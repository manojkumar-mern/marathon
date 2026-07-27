function DashboardSection({ title, action, children }) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-xl font-black italic text-sf-white">{title}</h3>
        {action}
      </div>
      {children}
    </section>
  )
}

export default DashboardSection
