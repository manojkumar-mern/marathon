import {
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'

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

function LineChart({
  data,
  xKey = 'month',
  yKey = 'value',
  color = '#f97316',
  height = 250,
  format,
}) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-[250px] items-center justify-center rounded-lg border border-dashed border-steel">
        <p className="text-sm text-muted-dim">No trend data available</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3d" vertical={false} />
        <XAxis
          dataKey={xKey}
          stroke="#6b7280"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          stroke="#6b7280"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v)}
        />
        <Tooltip content={<CustomTooltip format={format} />} />
        <Line
          type="monotone"
          dataKey={yKey}
          stroke={color}
          strokeWidth={2}
          dot={{ fill: color, r: 3, strokeWidth: 0 }}
          activeDot={{ fill: color, r: 5, stroke: '#1a1a2e', strokeWidth: 2 }}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  )
}

export default LineChart
