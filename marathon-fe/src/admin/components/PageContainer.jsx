function PageContainer({ title, description, children }) {
  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-black italic text-sf-white lg:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-muted-dim">{description}</p>
        )}
      </div>
      {children}
    </div>
  )
}

export default PageContainer
