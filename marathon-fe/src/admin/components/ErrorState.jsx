import { FaCircleExclamation } from 'react-icons/fa6'

function ErrorState({ message = 'Something went wrong', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-red-900/50 bg-red-950/20 py-12 text-center">
      <FaCircleExclamation className="mb-3 size-8 text-red-400" />
      <p className="text-sm text-red-400">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 rounded-lg border border-steel/60 px-4 py-2 text-xs font-medium text-muted-dim transition-colors hover:border-red-400/30 hover:text-red-400"
        >
          Try again
        </button>
      )}
    </div>
  )
}

export default ErrorState
