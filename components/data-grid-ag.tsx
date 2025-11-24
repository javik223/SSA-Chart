'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AllEnterpriseModule } from 'ag-grid-enterprise';
import {
  type ColDef,
  type GridApi,
  type GridReadyEvent,
  type CellEditingStoppedEvent,
  type GetContextMenuItemsParams,
  type MenuItemDef,
  type IHeaderParams,
  type ValueFormatterParams,
  ModuleRegistry,
  AllCommunityModule,
  themeQuartz,
} from 'ag-grid-community';
import { useChartStore } from '@/store/useChartStore';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { getColumnTypeIcon, type ColumnType } from '@/utils/dataTypeUtils';
import './data-grid-ag.css';

ModuleRegistry.registerModules( [ AllEnterpriseModule, AllCommunityModule ] );

interface DataGridAGProps {
  virtualData?: {
    syncToDuckDB: ( data: unknown[][] ) => Promise<void>;
    updateCell: ( row: number, col: number, value: unknown ) => Promise<void>;
    deleteRows: ( indices: number[] ) => Promise<void>;
  } | null;
  searchQuery?: string;
}

// Custom editable header component
interface EditableHeaderParams extends IHeaderParams {
  colIndex: number;
  onRename: ( colIndex: number, newName: string ) => void;
  dataType: ColumnType;
}

class EditableHeader {
  private eGui!: HTMLDivElement;
  private eText!: HTMLSpanElement;
  private eInput!: HTMLInputElement;
  private eTypeBadge!: HTMLSpanElement;
  private eSortIcon!: HTMLDivElement;
  private eFilterIcon!: HTMLDivElement;
  private eMenu!: HTMLDivElement;
  private params!: EditableHeaderParams;
  private isEditing = false;

  init( params: EditableHeaderParams ) {
    this.params = params;

    // Create main container
    this.eGui = document.createElement( 'div' );
    this.eGui.className = 'ag-header-wrapper';

    // Create left section (text + sort)
    const eLeftSection = document.createElement( 'div' );
    eLeftSection.className = 'ag-header-left-section';

    // Create type badge
    this.eTypeBadge = document.createElement( 'span' );
    this.eTypeBadge.className = 'data-grid-type-badge ag-header-type-badge';
    this.eTypeBadge.title = params.dataType;

    // Use Calendar icon for date type, otherwise use text icon
    if ( params.dataType === 'date' ) {
      this.eTypeBadge.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M8 2v4"/>
          <path d="M16 2v4"/>
          <rect width="18" height="18" x="3" y="4" rx="2"/>
          <path d="M3 10h18"/>
        </svg>
      `;
    } else {
      this.eTypeBadge.textContent = getColumnTypeIcon( params.dataType );
    }

    // Create text element
    this.eText = document.createElement( 'span' );
    this.eText.textContent = params.displayName;
    this.eText.className = 'ag-header-cell-text ag-header-text';

    // Create input element (hidden initially)
    this.eInput = document.createElement( 'input' );
    this.eInput.type = 'text';
    this.eInput.value = params.displayName;
    this.eInput.className = 'ag-header-input';

    // Create sort indicator
    this.eSortIcon = document.createElement( 'div' );
    this.eSortIcon.className = 'ag-header-icon ag-sort-indicator-icon';
    this.updateSortIcon();

    eLeftSection.appendChild( this.eTypeBadge );
    eLeftSection.appendChild( this.eText );
    eLeftSection.appendChild( this.eInput );
    eLeftSection.appendChild( this.eSortIcon );

    // Create filter icon
    this.eFilterIcon = document.createElement( 'div' );
    this.eFilterIcon.className = 'ag-header-icon ag-filter-icon';
    if ( params.column.isFilterActive() ) {
      this.eFilterIcon.innerHTML =
        '<span class="ag-icon ag-icon-filter"></span>';
    }

    // Create menu icon
    this.eMenu = document.createElement( 'div' );
    this.eMenu.className = 'ag-header-icon ag-header-cell-menu-button';
    this.eMenu.innerHTML = '<span class="ag-icon ag-icon-menu"></span>';
    this.eMenu.style.cursor = 'pointer';

    // Assemble the header
    this.eGui.appendChild( eLeftSection );
    if ( params.enableMenu ) {
      this.eGui.appendChild( this.eFilterIcon );
      this.eGui.appendChild( this.eMenu );
    }

    // Add double-click to edit on text
    this.eText.addEventListener( 'dblclick', ( e ) => {
      e.stopPropagation();
      this.startEditing();
    } );

    // Add click to sort on left section
    eLeftSection.addEventListener( 'click', ( e ) => {
      if ( !this.isEditing && e.target !== this.eInput ) {
        this.onSortRequested( e );
      }
    } );

    // Add click to show menu
    this.eMenu.addEventListener( 'click', () => {
      params.showColumnMenu( this.eMenu );
    } );

    // Handle input events
    this.eInput.addEventListener( 'blur', () => this.stopEditing( true ) );
    this.eInput.addEventListener( 'click', ( e ) => e.stopPropagation() );
    this.eInput.addEventListener( 'keydown', ( e: KeyboardEvent ) => {
      e.stopPropagation();
      if ( e.key === 'Enter' ) {
        this.stopEditing( true );
      } else if ( e.key === 'Escape' ) {
        this.stopEditing( false );
      }
    } );
  }

  getGui() {
    return this.eGui;
  }

  private updateSortIcon() {
    const sort = this.params.column.getSort();

    if ( sort === 'asc' ) {
      this.eSortIcon.innerHTML = '<span class="ag-icon ag-icon-asc"></span>';
      this.eSortIcon.style.display = 'block';
    } else if ( sort === 'desc' ) {
      this.eSortIcon.innerHTML = '<span class="ag-icon ag-icon-desc"></span>';
      this.eSortIcon.style.display = 'block';
    } else {
      this.eSortIcon.innerHTML = '';
      this.eSortIcon.style.display = 'none';
    }
  }

  private onSortRequested( event: MouseEvent ) {
    this.params.progressSort( event.shiftKey );
  }

  private startEditing() {
    this.isEditing = true;
    this.eText.classList.add( 'editing' );
    this.eInput.classList.add( 'editing' );
    this.eInput.value = this.eText.textContent || '';
    this.eInput.focus();
    this.eInput.select();
  }

  private stopEditing( save: boolean ) {
    if ( !this.isEditing ) return;

    this.isEditing = false;
    const newValue = this.eInput.value.trim();

    if ( save && newValue && newValue !== this.eText.textContent ) {
      this.eText.textContent = newValue;
      this.params.onRename( this.params.colIndex, newValue );
    }

    this.eInput.classList.remove( 'editing' );
    this.eText.classList.remove( 'editing' );
  }

  refresh( params: EditableHeaderParams ) {
    this.params = params;
    if ( !this.isEditing ) {
      this.eText.textContent = params.displayName;
      this.eInput.value = params.displayName;
    }

    // Update type badge
    this.eTypeBadge.title = params.dataType;
    if ( params.dataType === 'date' ) {
      this.eTypeBadge.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M8 2v4"/>
          <path d="M16 2v4"/>
          <rect width="18" height="18" x="3" y="4" rx="2"/>
          <path d="M3 10h18"/>
        </svg>
      `;
    } else {
      this.eTypeBadge.textContent = getColumnTypeIcon( params.dataType );
    }

    // Update sort icon
    this.updateSortIcon();

    // Update filter icon
    if ( params.column.isFilterActive() ) {
      this.eFilterIcon.innerHTML =
        '<span class="ag-icon ag-icon-filter"></span>';
    } else {
      this.eFilterIcon.innerHTML = '';
    }

    return true;
  }
}

export function DataGridAG( { virtualData, searchQuery = '' }: DataGridAGProps ) {
  const data = useChartStore( ( state ) => state.data );
  const setData = useChartStore( ( state ) => state.setData );
  const columnMapping = useChartStore( ( state ) => state.columnMapping );
  const columnTypes = useChartStore( ( state ) => state.columnTypes );

  const gridRef = useRef<AgGridReact>( null );
  const [ gridApi, setGridApi ] = useState<GridApi | null>( null );

  // Error handlers
  const handleSyncError = useCallback( ( err: unknown ) => {
    console.error(
      '[DataGridAG] Failed to sync to DuckDB:',
      err
    );
  }, [] );

  const handleUpdateCellError = useCallback( ( err: unknown ) => {
    console.error( '[DataGridAG] Failed to update cell:', err );
  }, [] );

  // Handle column rename
  const handleRenameColumn = useCallback(
    ( colIndex: number, newName: string ) => {
      const currentData = [ ...data ];
      if ( !currentData[ 0 ] ) return;

      // Update header row
      currentData[ 0 ] = [ ...currentData[ 0 ] ];
      currentData[ 0 ][ colIndex ] = newName;
      setData( currentData );

      // Sync to DuckDB in background
      if ( virtualData ) {
        virtualData.syncToDuckDB( currentData ).catch( handleSyncError );
      }
    },
    [ data, setData, virtualData ]
  );



  // Convert data format: first row is header, rest is data
  const { headers, rowData } = useMemo( () => {
    if ( !data || data.length === 0 ) {
      return { headers: [], rowData: [] };
    }

    const headers = ( data[ 0 ] as string[] ) || [];
    const rowData = data.slice( 1 ).map( ( row, index ) => {
      const rowObj: Record<string, unknown> = { _rowIndex: index };
      headers.forEach( ( _, colIndex ) => {
        rowObj[ `col_${ colIndex }` ] = row[ colIndex ];
      } );
      return rowObj;
    } );

    return { headers, rowData };
  }, [ data ] );

  // Cell class generator
  const getCellClass = useCallback(
    ( colIndex: number ) => {
      const isLabelColumn = columnMapping.labels === colIndex;
      const isValueColumn = columnMapping.values.includes( colIndex );
      const classes = [];
      if ( isLabelColumn ) classes.push( 'bg-pink-50' );
      if ( isValueColumn ) classes.push( 'bg-purple-50' );
      return classes;
    },
    [ columnMapping ]
  );

  // Value formatter
  const formatCellValue = useCallback( ( params: ValueFormatterParams ) => {
    if ( params.value === null || params.value === undefined ) return '';
    return String( params.value );
  }, [] );

  // Generate column definitions
  const columnDefs: ColDef[] = useMemo( () => {
    if ( headers.length === 0 ) return [];

    const defs: ColDef[] = [
      {
        headerName: '#',
        valueGetter: 'node.rowIndex + 1',
        width: 60,
        minWidth: 60,
        pinned: 'left',
        suppressMovable: true,
        resizable: false,
        sortable: false,
        filter: false,
        editable: false,
        cellClass: 'ag-row-number-cell',
        headerClass: 'ag-row-number-header',
      },
    ];

    const dataCols = headers.map( ( header, index ) => {
      const colId = `col_${ index }`;
      const type = columnTypes[ index ]?.type || 'text';

      return {
        field: colId,
        headerName: header || `Column ${ index + 1 }`,
        headerComponent: EditableHeader,
        headerComponentParams: {
          colIndex: index,
          onRename: handleRenameColumn,
          dataType: type as ColumnType,
        },
        editable: true,
        sortable: true,
        filter: true,
        resizable: true,
        cellClass: getCellClass( index ),
        cellDataType:
          type === 'number' ? 'number' : type === 'date' ? 'date' : 'text',
        valueFormatter: formatCellValue,
        headerClass: 'font-semibold',
        ...( index == 0 ? { rowDrag: true, pinned: 'left' as const } : {} ),
      };
    } );

    return [ ...defs, ...dataCols ];
  }, [ headers, columnTypes, columnMapping, handleRenameColumn, getCellClass ] );



  // Default column configuration
  const defaultColDef: ColDef = useMemo(
    () => ( {
      flex: 1,
      minWidth: 100,
      editable: true,
      sortable: true,
      filter: true,
      resizable: true,
      suppressMovable: true, // Disable column reordering to prevent errors
    } ),
    []
  );

  // Handle grid ready
  const onGridReady = useCallback(
    ( params: GridReadyEvent ) => {
      setGridApi( params.api );
      // Apply initial search query if any
      if ( searchQuery ) {
        params.api.setGridOption( 'quickFilterText', searchQuery );
      }
    },
    [ searchQuery ]
  );

  // Apply search filter when searchQuery changes
  useEffect( () => {
    if ( gridApi ) {
      gridApi.setGridOption( 'quickFilterText', searchQuery );
    }
  }, [ gridApi, searchQuery ] );

  // Handle cell value change (optimistic)
  const onCellEditingStopped = useCallback(
    ( event: CellEditingStoppedEvent ) => {
      if ( event.oldValue === event.newValue ) return;

      const rowIndex = event.node.rowIndex;
      const colMatch = event.column.getColId().match( /col_(\d+)/ );
      if ( rowIndex === null || !colMatch ) return;

      const colIndex = parseInt( colMatch[ 1 ] );
      const newValue = event.newValue;

      // Optimistic update to data
      const currentData = [ ...data ];
      if ( currentData[ rowIndex + 1 ] ) {
        currentData[ rowIndex + 1 ] = [ ...currentData[ rowIndex + 1 ] ];
        currentData[ rowIndex + 1 ][ colIndex ] = newValue;
        setData( currentData );
      }

      // Then sync to DuckDB in background
      if ( virtualData ) {
        virtualData.updateCell( rowIndex, colIndex, newValue ).catch( handleUpdateCellError );
      }
    },
    [ data, setData, virtualData ]
  );



  // Handle row reordering
  const onRowDragEnd = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ( event: any ) => {
      const movingNode = event.node;
      const overNode = event.overNode;

      if ( !movingNode || !overNode ) return;

      const fromIndex = movingNode.rowIndex;
      const toIndex = overNode.rowIndex;

      if ( fromIndex === null || toIndex === null || fromIndex === toIndex )
        return;

      // Optimistically update data
      const currentData = [ ...data ];
      const [ headerRow, ...dataRows ] = currentData;

      // Remove the row from its current position
      const [ movedRow ] = dataRows.splice( fromIndex, 1 );
      // Insert it at the new position
      dataRows.splice( toIndex, 0, movedRow );

      // Reconstruct the data with header
      const newData = [ headerRow, ...dataRows ];
      setData( newData );

      // Sync to DuckDB in background
      if ( virtualData ) {
        virtualData.syncToDuckDB( newData ).catch( handleSyncError );
      }
    },
    [ data, setData, virtualData ]
  );

  // Handle fill operation (drag to fill)
  const onFillEnd = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ( event: any ) => {
      // Get all the row data after the fill operation
      const updatedData: unknown[][] = [ data[ 0 ] ]; // Start with header row

      // Iterate through all nodes to get the updated data
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      event.api.forEachNode( ( node: any ) => {
        const rowData: unknown[] = [];
        headers.forEach( ( _, colIndex ) => {
          rowData.push( node.data[ `col_${ colIndex }` ] );
        } );
        updatedData.push( rowData );
      } );

      // Update the store
      setData( updatedData );

      // Sync to DuckDB in background
      if ( virtualData ) {
        virtualData.syncToDuckDB( updatedData ).catch( handleSyncError );
      }
    },
    [ data, headers, setData, virtualData ]
  );

  // Context menu actions
  const handleCopyAction = useCallback( ( api: GridApi | undefined ) => {
    api?.copySelectedRangeToClipboard();
  }, [] );

  const handleCopyWithHeadersAction = useCallback( ( api: GridApi | undefined ) => {
    api?.copySelectedRangeToClipboard( { includeHeaders: true } );
  }, [] );

  const handlePasteAction = useCallback( ( api: GridApi | undefined ) => {
    api?.pasteFromClipboard();
  }, [] );

  // Context menu
  const getContextMenuItems = useCallback(
    ( params: GetContextMenuItemsParams ): MenuItemDef[] => {
      const result: MenuItemDef[] = [
        {
          name: 'Copy',
          action: () => handleCopyAction( params.api ),
        },
        {
          name: 'Copy with Headers',
          action: () => handleCopyWithHeadersAction( params.api ),
        },
        { name: 'Paste', action: () => handlePasteAction( params.api ) },
        {
          name: '',
          disabled: true,
          cssClasses: [ 'ag-menu-separator' ],
        },
        {
          name: 'Rename Column',
          icon: '<span class="ag-icon ag-icon-columns"></span>',
          action: () => {
            if ( !params.column ) return;
            const colMatch = params.column.getColId().match( /col_(\d+)/ );
            if ( !colMatch ) return;

            const colIndex = parseInt( colMatch[ 1 ] );
            const currentName = headers[ colIndex ] || `Column ${ colIndex + 1 }`;
            const newName = prompt( 'Enter new column name:', currentName );

            if ( newName && newName.trim() && newName !== currentName ) {
              handleRenameColumn( colIndex, newName.trim() );
            }
          },
        },
        {
          name: 'Delete Column',
          icon: '<span class="ag-icon ag-icon-cross"></span>',
          action: () => {
            if ( !params.column ) return;
            const colMatch = params.column.getColId().match( /col_(\d+)/ );
            if ( !colMatch ) return;

            const colIndex = parseInt( colMatch[ 1 ] );

            // Confirm deletion
            const headerName = headers[ colIndex ] || `Column ${ colIndex + 1 }`;
            if ( !confirm( `Are you sure you want to delete column "${ headerName }"?` ) ) {
              return;
            }

            const currentData = [ ...data ];

            // Remove column from header and all rows
            const newData = currentData.map( ( row ) => {
              const newRow = [ ...( row as unknown[] ) ];
              newRow.splice( colIndex, 1 );
              return newRow;
            } );

            setData( newData, { index: colIndex, count: 1 } );

            if ( virtualData ) {
              virtualData.syncToDuckDB( newData ).catch( console.error );
            }
          },
        },
        {
          name: 'Insert Column Left',
          icon: '<span class="ag-icon ag-icon-left"></span>',
          action: () => {
            if ( !params.column ) return;
            const colMatch = params.column.getColId().match( /col_(\d+)/ );
            if ( !colMatch ) return;

            const colIndex = parseInt( colMatch[ 1 ] );
            const currentData = [ ...data ];

            // Insert empty column at the specified index
            const newData = currentData.map( ( row ) => {
              const newRow = [ ...( row as unknown[] ) ];
              newRow.splice( colIndex, 0, '' ); // Insert empty value
              return newRow;
            } );

            // Update header with a default name
            newData[ 0 ][ colIndex ] = `Column ${ colIndex + 1 }`;

            setData( newData );

            if ( virtualData ) {
              virtualData.syncToDuckDB( newData ).catch( console.error );
            }
          },
        },
        {
          name: 'Insert Column Right',
          icon: '<span class="ag-icon ag-icon-right"></span>',
          action: () => {
            if ( !params.column ) return;
            const colMatch = params.column.getColId().match( /col_(\d+)/ );
            if ( !colMatch ) return;

            const colIndex = parseInt( colMatch[ 1 ] );
            const currentData = [ ...data ];

            // Insert empty column after the specified index
            const newData = currentData.map( ( row ) => {
              const newRow = [ ...( row as unknown[] ) ];
              newRow.splice( colIndex + 1, 0, '' ); // Insert empty value after current column
              return newRow;
            } );

            // Update header with a default name
            newData[ 0 ][ colIndex + 1 ] = `Column ${ colIndex + 2 }`;

            setData( newData );

            if ( virtualData ) {
              virtualData.syncToDuckDB( newData ).catch( console.error );
            }
          },
        },
        {
          name: '',
          disabled: true,
          cssClasses: [ 'ag-menu-separator' ],
        },
        {
          name: 'Insert Row Above',
          icon: '<span class="ag-icon ag-icon-contracted"></span>',
          action: () => {
            if (
              !params.node ||
              params.node.rowIndex === null ||
              params.node.rowIndex === undefined
            )
              return;
            const currentData = [ ...data ];
            const colCount = headers.length;
            const emptyRow = Array( colCount ).fill( '' );
            currentData.splice( params.node.rowIndex + 1, 0, emptyRow );
            setData( currentData );

            if ( virtualData ) {
              virtualData.syncToDuckDB( currentData ).catch( console.error );
            }
          },
        },
        {
          name: 'Insert Row Below',
          icon: '<span class="ag-icon ag-icon-expanded"></span>',
          action: () => {
            if (
              !params.node ||
              params.node.rowIndex === null ||
              params.node.rowIndex === undefined
            )
              return;
            const currentData = [ ...data ];
            const colCount = headers.length;
            const emptyRow = Array( colCount ).fill( '' );
            currentData.splice( params.node.rowIndex + 2, 0, emptyRow );
            setData( currentData );

            if ( virtualData ) {
              virtualData.syncToDuckDB( currentData ).catch( console.error );
            }
          },
        },
        {
          name: 'Delete Row',
          icon: '<span class="ag-icon ag-icon-cross"></span>',
          action: () => {
            if (
              !params.node ||
              params.node.rowIndex === null ||
              params.node.rowIndex === undefined
            )
              return;
            const rowIndex = params.node.rowIndex;
            const currentData = [ ...data ];
            currentData.splice( rowIndex + 1, 1 );
            setData( currentData );

            if ( virtualData ) {
              virtualData.deleteRows( [ rowIndex ] ).catch( console.error );
            }
          },
        },
        {
          name: '',
          disabled: true,
          cssClasses: [ 'ag-menu-separator' ],
        },
        {
          name: 'Clear Cell',
          action: () => {
            if (
              !params.node ||
              params.node.rowIndex === null ||
              params.node.rowIndex === undefined ||
              !params.column
            )
              return;
            const colMatch = params.column.getColId().match( /col_(\d+)/ );
            if ( !colMatch ) return;

            const colIndex = parseInt( colMatch[ 1 ] );
            const rowIndex = params.node.rowIndex;
            const currentData = [ ...data ];
            if ( currentData[ rowIndex + 1 ] ) {
              currentData[ rowIndex + 1 ] = [ ...currentData[ rowIndex + 1 ] ];
              currentData[ rowIndex + 1 ][ colIndex ] = '';
              setData( currentData );

              if ( virtualData ) {
                virtualData
                  .updateCell( rowIndex, colIndex, '' )
                  .catch( console.error );
              }
            }
          },
        },
        {
          name: '',
          disabled: true,
          cssClasses: [ 'ag-menu-separator' ],
        },
        { name: 'Export', action: () => params.api?.exportDataAsCsv() },
      ];

      return result;
    },
    [ data, headers, setData, virtualData, handleRenameColumn, handleCopyAction, handleCopyWithHeadersAction, handlePasteAction ]
  );

  // Export to CSV
  const handleExport = useCallback( () => {
    if ( !gridApi ) return;
    gridApi.exportDataAsCsv( {
      fileName: 'data-export.csv',
    } );
  }, [ gridApi ] );

  // Row ID getter
  const getRowId = useCallback( ( params: any ) => {
    return String( params.data._rowIndex );
  }, [] );

  if ( !data || data.length === 0 ) {
    return (
      <div className='data-grid-empty'>
        <p>No data loaded. Upload a file to get started.</p>
      </div>
    );
  }

  const myTheme = themeQuartz.withParams( {
    borderWidth: 0.75,
    cellFontFamily: 'CanvaSans',
    borderColor: '#B1B1B1',
    cellTextColor: '#000000',
    headerFontFamily: 'CanvaSans',
    headerTextColor: '#000000',
    rowBorder: {
      // color: '#D1D1D1',
      width: 0.75,
    },
    columnBorder: {
      // color: '#D1D1D1',
      width: 0.75,
    },
    headerRowBorder: {
      // color: '#D1D1D1',
      width: 0.75,
    },
    dragHandleColor: '#ff00000',
  } );

  return (
    <div className='data-grid-container'>
      {/* Toolbar */ }
      <div className='data-grid-toolbar'>
        <div className='data-grid-toolbar-left'>
          <Button variant='outline' size='sm' onClick={ handleExport }>
            <Download className='data-grid-export-icon' />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Grid */ }
      <div className='data-grid-wrapper ag-theme-alpine'>
        <AgGridReact
          ref={ gridRef }
          rowData={ rowData }
          columnDefs={ columnDefs }
          defaultColDef={ defaultColDef }
          onGridReady={ onGridReady }
          onCellEditingStopped={ onCellEditingStopped }
          onRowDragEnd={ onRowDragEnd }
          onFillEnd={ onFillEnd }
          getContextMenuItems={ getContextMenuItems }
          rowDragEntireRow={ true }
          rowSelection={ {
            mode: 'multiRow',
            headerCheckbox: false,
            checkboxes: false,
            masterSelects: 'detail',
          } }
          cellSelection={ {
            handle: {
              mode: 'fill',
            },
          } }
          undoRedoCellEditing={ true }
          undoRedoCellEditingLimit={ 20 }
          animateRows={ true }
          suppressMoveWhenRowDragging={ true }
          getRowId={ getRowId }
          theme={ myTheme }
          pagination={ true }
          paginationPageSize={ 100 }
          enableRowPinning={ true }
          rowDragMultiRow={ true }
          quickFilterText={ searchQuery }
        />
      </div>
    </div>
  );
}
