import { FaMagnifyingGlass } from 'react-icons/fa6'

function NoResultsState({ message = 'No results found', onClear }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-steel bg-carbon py-12 text-center">
      <FaMagnifyingGlass className="mb-3 size-8 text-muted-dim" />
      <p className="text-sm text-muted">{message}</p>
      {onClear && (
        <button
          onClick={onClear}
          className="mt-4 text-xs font-medium text-ember hover:underline"
        >
          Clear search and filters
        </button>
      )}
    </div>
  )
}

export default NoResultsState
