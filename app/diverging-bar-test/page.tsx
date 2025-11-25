'use client';

import { DivergingBarChart } from '@/components/charts';
import { useState } from 'react';

export default function DivergingBarTestPage() {
  // US State population data: 2010 to 2019 change
  const [data] = useState([
    { state: 'California', '2010': 37254523, '2019': 39512223, change: 2257700 },
    { state: 'Texas', '2010': 25145561, '2019': 28995881, change: 3850320 },
    { state: 'Florida', '2010': 18801310, '2019': 21477737, change: 2676427 },
    { state: 'New York', '2010': 19378102, '2019': 19453561, change: 75459 },
    { state: 'Pennsylvania', '2010': 12702379, '2019': 12801989, change: 99610 },
    { state: 'Illinois', '2010': 12830632, '2019': 12671821, change: -158811 },
    { state: 'Ohio', '2010': 11536504, '2019': 11689100, change: 152596 },
    { state: 'Georgia', '2010': 9687653, '2019': 10617423, change: 929770 },
    { state: 'North Carolina', '2010': 9535483, '2019': 10488084, change: 952601 },
    { state: 'Michigan', '2010': 9883640, '2019': 9986857, change: 103217 },
    { state: 'New Jersey', '2010': 8791894, '2019': 8882190, change: 90296 },
    { state: 'Virginia', '2010': 8001024, '2019': 8535519, change: 534495 },
    { state: 'Washington', '2010': 6724540, '2019': 7614893, change: 890353 },
    { state: 'Arizona', '2010': 6392017, '2019': 7278717, change: 886700 },
    { state: 'Massachusetts', '2010': 6547629, '2019': 6949503, change: 401874 },
    { state: 'Tennessee', '2010': 6346105, '2019': 6833174, change: 487069 },
    { state: 'Indiana', '2010': 6483802, '2019': 6732219, change: 248417 },
    { state: 'Missouri', '2010': 5988927, '2019': 6137428, change: 148501 },
    { state: 'Maryland', '2010': 5773552, '2019': 6045680, change: 272128 },
    { state: 'Wisconsin', '2010': 5686986, '2019': 5822434, change: 135448 },
    { state: 'Colorado', '2010': 5029196, '2019': 5758736, change: 729540 },
    { state: 'Minnesota', '2010': 5303925, '2019': 5639632, change: 335707 },
    { state: 'South Carolina', '2010': 4625364, '2019': 5148714, change: 523350 },
    { state: 'Alabama', '2010': 4779736, '2019': 4903185, change: 123449 },
    { state: 'Louisiana', '2010': 4533372, '2019': 4648794, change: 115422 },
    { state: 'Kentucky', '2010': 4339367, '2019': 4467673, change: 128306 },
    { state: 'Oregon', '2010': 3831074, '2019': 4217737, change: 386663 },
    { state: 'Oklahoma', '2010': 3751351, '2019': 3956971, change: 205620 },
    { state: 'Connecticut', '2010': 3574097, '2019': 3565287, change: -8810 },
    { state: 'Utah', '2010': 2763885, '2019': 3205958, change: 442073 },
    { state: 'Puerto Rico', '2010': 3725789, '2019': 3193694, change: -532095 },
    { state: 'Iowa', '2010': 3046355, '2019': 3155070, change: 108715 },
    { state: 'Nevada', '2010': 2700551, '2019': 3080156, change: 379605 },
    { state: 'Arkansas', '2010': 2915918, '2019': 3017825, change: 101907 },
    { state: 'Mississippi', '2010': 2967297, '2019': 2976149, change: 8852 },
    { state: 'Kansas', '2010': 2853118, '2019': 2913314, change: 60196 },
    { state: 'New Mexico', '2010': 2059179, '2019': 2096829, change: 37650 },
    { state: 'Nebraska', '2010': 1826341, '2019': 1934408, change: 108067 },
    { state: 'West Virginia', '2010': 1852994, '2019': 1792065, change: -60929 },
    { state: 'Idaho', '2010': 1567582, '2019': 1787147, change: 219565 },
    { state: 'Hawaii', '2010': 1360301, '2019': 1415872, change: 55571 },
    { state: 'New Hampshire', '2010': 1316470, '2019': 1359711, change: 43241 },
    { state: 'Maine', '2010': 1328361, '2019': 1344212, change: 15851 },
    { state: 'Montana', '2010': 989415, '2019': 1068778, change: 79363 },
    { state: 'Rhode Island', '2010': 1052567, '2019': 1059361, change: 6794 },
    { state: 'Delaware', '2010': 897934, '2019': 973764, change: 75830 },
    { state: 'South Dakota', '2010': 814180, '2019': 884659, change: 70479 },
    { state: 'North Dakota', '2010': 672591, '2019': 762062, change: 89471 },
    { state: 'Alaska', '2010': 710231, '2019': 731545, change: 21314 },
    { state: 'District of Columbia', '2010': 601723, '2019': 705749, change: 104026 },
    { state: 'Vermont', '2010': 625741, '2019': 623989, change: -1752 },
    { state: 'Wyoming', '2010': 563626, '2019': 578759, change: 15133 },
  ]);

  const [sortBy, setSortBy] = useState<'none' | 'value' | 'ascending' | 'descending'>('ascending');
  const [showLabels, setShowLabels] = useState(true);
  const [useGradientColors, setUseGradientColors] = useState(true);
  const [labelPosition, setLabelPosition] = useState<'inside' | 'outside'>('outside');

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Diverging Bar Chart</h1>
        <p className="text-gray-600 mb-8">
          Visualize positive and negative values from a central baseline. Perfect for showing
          population change, profit/loss, or any metric with variance.
        </p>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Controls</h2>
          <div className="flex gap-6 flex-wrap">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="none">None (Original Order)</option>
                <option value="ascending">Ascending (Low to High)</option>
                <option value="descending">Descending (High to Low)</option>
                <option value="value">By Value</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="block text-sm font-medium text-gray-700">Options</label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showLabels}
                  onChange={(e) => setShowLabels(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm">Show value labels</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={useGradientColors}
                  onChange={(e) => setUseGradientColors(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm">Use gradient colors</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Label Position</label>
              <select
                value={labelPosition}
                onChange={(e) => setLabelPosition(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="inside">Inside bars</option>
                <option value="outside">Outside bars</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Population Change by State (2010-2019)</h2>
          <div className="w-full" style={{ height: '1600px' }}>
            <DivergingBarChart
              data={data}
              labelKey="state"
              valueKeys={['change']}
              width={1200}
              height={1600}
              xAxisShow={true}
              xAxisTitle="Population Change"
              xAxisPosition="top"
              xAxisShowGrid={true}
              xAxisGridColor="#e5e7eb"
              xAxisGridOpacity={0.3}
              yAxis={{
                show: true,
                position: 'right',
                scaleType: 'linear',
                min: null,
                max: null,
                flip: false,
                configureDefaultMinMax: true,
                roundMin: false,
                roundMax: false,
                title: '',
                titleType: 'auto',
                titlePosition: 'top-bottom',
                titleWeight: 'regular',
                titleColor: '#000000',
                titleSize: 12,
                titlePadding: 40,
                showGrid: false,
                gridColor: '#e5e7eb',
                gridWidth: 1,
                gridOpacity: 0.5,
                gridDashArray: '0',
                showDomain: false,
                tickCount: 10,
                tickSize: 0,
                tickPadding: 8,
                tickFormat: '',
                tickPosition: 'outside',
                labelWeight: 'regular',
                labelColor: '#374151',
                labelSize: 11,
                labelSpacing: 15,
                labelRotation: 0,
                titleAlignment: 'center',
                titleArrow: false,
                domainColor: '#000000',
                edgePadding: 0,
              }}
              showLabels={showLabels}
              sortBy={sortBy}
              useGradientColors={useGradientColors}
              labelPosition={labelPosition}
              positiveColor="#3b82f6"
              negativeColor="#dc2626"
              legendShow={false}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">About This Chart</h2>
          <div className="prose max-w-none">
            <p className="text-gray-700 mb-4">
              The diverging bar chart is ideal for visualizing data that has both positive and negative values.
              Each bar extends from a central zero baseline, making it easy to compare magnitudes in both directions.
            </p>

            <h3 className="text-lg font-semibold mt-4 mb-2">Key Features:</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Central baseline at zero for easy comparison</li>
              <li>Color-coded bars for positive (green) and negative (red) values</li>
              <li>Optional value labels positioned at bar ends</li>
              <li>Flexible sorting options (by value, label, or custom order)</li>
              <li>Smooth animations on load and update</li>
              <li>Responsive and interactive</li>
            </ul>

            <h3 className="text-lg font-semibold mt-4 mb-2">Use Cases:</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Population change or growth rates</li>
              <li>Profit and loss statements</li>
              <li>Survey responses (agree/disagree)</li>
              <li>Performance vs. baseline or target</li>
              <li>Temperature anomalies</li>
              <li>Budget variance analysis</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
