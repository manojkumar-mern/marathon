import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

function renderCenterLabel({ data }) {
  if (data.length === 0) return null
  const total = data.reduce((s, d) => s + d.value, 0)
  return (
    <text
      x={0}
      y={0}
      textAnchor="middle"
      dominantBaseline="middle"
      className="fill-sf-white"
      fontSize={22}
      fontWeight={900}
      fontFamily="'Plus Jakarta Sans', sans-serif"
      dy={-6}
    >
      {total.toLocaleString()}
    </text>
  )
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div className="rounded-lg border border-steel bg-carbon px-3 py-2 shadow-xl">
      <div className="flex items-center gap-2">
        <span className="size-2 rounded-full" style={{ backgroundColor: d.payload.color || d.color }} />
        <p className="text-xs font-medium text-muted-dim">{d.name}</p>
      </div>
      <p className="text-sm font-bold text-sf-white">{d.value.toLocaleString()}</p>
    </div>
  )
}

const FALLBACK_COLORS = ['#f97316', '#06b6d4', '#8b5cf6', '#22c55e', '#ef4444', '#eab308']

function DonutChart({ data, nameKey = 'name', valueKey = 'value', colors, size = 200, innerRadius = 60 }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-[200px] items-center justify-center rounded-lg border border-dashed border-steel">
        <p className="text-sm text-muted-dim">No data available</p>
      </div>
    )
  }

  const chartColors = colors || data.map((_, i) => FALLBACK_COLORS[i % FALLBACK_COLORS.length])

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
      <ResponsiveContainer width={size} height={size}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={size / 2 - 10}
            dataKey={valueKey}
            nameKey={nameKey}
            strokeWidth={0}
          >
            {data.map((entry, i) => (
              <Cell key={entry[nameKey] || i} fill={chartColors[i]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          {renderCenterLabel({ data, innerRadius })}
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-col gap-2 text-xs">
        {data.map((entry, i) => {
          const total = data.reduce((s, d) => s + d[valueKey], 0)
          const pct = total > 0 ? ((entry[valueKey] / total) * 100).toFixed(1) : 0
          return (
            <div key={entry[nameKey] || i} className="flex items-center gap-2">
              <span className="size-2.5 rounded-sm" style={{ backgroundColor: chartColors[i] }} />
              <span className="text-muted-dim">{entry[nameKey]}</span>
              <span className="font-medium text-sf-white">
                {entry[valueKey].toLocaleString()} ({pct}%)
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default DonutChart
