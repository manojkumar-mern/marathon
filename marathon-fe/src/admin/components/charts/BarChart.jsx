import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

const BAR_COLORS = ['#f97316', '#06b6d4', '#8b5cf6', '#22c55e', '#eab308', '#ef4444']

function CustomTooltip({ active, payload, label, format }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-steel bg-carbon px-3 py-2 shadow-xl">
      <p className="text-xs font-medium text-muted-dim">{label}</p>
      <p className="text-sm font-bold text-sf-white">
        {format ? format(payload[0].value) : payload[0].value.toLocaleString()}
      </p>
    </div>
  )
}

function BarChart({
  data,
  xKey = 'label',
  yKey = 'value',
  height = 250,
  format,
  layout = 'vertical',
  useDistinctColors = false,
}) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-[250px] items-center justify-center rounded-lg border border-dashed border-steel">
        <p className="text-sm text-muted-dim">No data available</p>
      </div>
    )
  }

  const isVertical = layout === 'vertical'

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart
        data={data}
        layout={isVertical ? 'horizontal' : 'vertical'}
        margin={{ top: 5, right: 10, left: isVertical ? 0 : 0, bottom: 5 }}
        barSize={isVertical ? 24 : 16}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#2a2a3d"
          horizontal={isVertical}
          vertical={!isVertical}
        />
        {isVertical ? (
          <>
            <XAxis
              dataKey={xKey}
              stroke="#6b7280"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              interval={0}
              angle={-30}
              textAnchor="end"
              height={60}
            />
            <YAxis stroke="#6b7280" fontSize={11} tickLine={false} axisLine={false} />
          </>
        ) : (
          <>
            <XAxis
              type="number"
              stroke="#6b7280"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v)}
            />
            <YAxis
              type="category"
              dataKey={xKey}
              stroke="#6b7280"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              width={60}
            />
          </>
        )}
        <Tooltip content={<CustomTooltip format={format} />} />
        <Bar dataKey={yKey} radius={isVertical ? [4, 4, 0, 0] : [0, 4, 4, 0]}>
          {useDistinctColors
            ? data.map((entry, i) => (
                <Cell key={i} fill={entry.color || BAR_COLORS[i % BAR_COLORS.length]} />
              ))
            : null}
        </Bar>
      </RechartsBarChart>
    </ResponsiveContainer>
  )
}

export default BarChart
