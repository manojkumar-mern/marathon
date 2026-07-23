import { FaWhatsapp } from 'react-icons/fa6'
import { Link } from 'react-router-dom'

function WhatsAppFloat() {
  return (
    <div className="group fixed bottom-6 right-6 z-[100]">
      {/* Tooltip */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-full right-0 mb-3 whitespace-nowrap rounded-xl border border-steel bg-obsidian/95 px-3 py-2 text-xs font-semibold text-sf-white shadow-xl opacity-0 transition-opacity duration-200 group-hover:opacity-100"
      >
        Need Help? Chat with us
        <span className="absolute -bottom-1.5 right-4 size-3 rotate-45 border-b border-r border-steel bg-obsidian/95" />
      </div>

      {/* Pulse rings */}
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full bg-[#25D366] opacity-0"
        style={{ animation: 'whatsappPulse 3s ease-out infinite' }}
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full bg-[#25D366] opacity-0"
        style={{ animation: 'whatsappPulse 3s ease-out infinite 1.2s' }}
      />

      {/* Button */}
      <Link
        to="/contact"
        aria-label="Contact STRIDEFORGE support"
        className="relative flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 transition-transform duration-200 hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
      >
        <FaWhatsapp className="text-2xl" aria-hidden="true" />
      </Link>
    </div>
  )
}

export default WhatsAppFloat
