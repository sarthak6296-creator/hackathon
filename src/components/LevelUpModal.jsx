import { motion, AnimatePresence } from 'framer-motion'

export default function LevelUpModal({ result, onClose }) {
  return (
    <AnimatePresence>
      {result && (
        <motion.div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Level up celebration"
        >
          <motion.div
            initial={{ scale: 0.6, opacity: 0, rotate: -4 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            className="pixel-border bg-dungeon-panel p-8 text-center max-w-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="font-pixel text-dungeon-gold text-xs mb-2">★ LEVEL UP ★</p>
            <p className="font-pixel text-dungeon-accent text-2xl mb-3">LV {result.newLevel}</p>
            <p style={{ color: '#9b96b8' }} className="mb-4">
              +{result.xpGain} XP · +{result.goldGain} gold earned
            </p>
            <button className="pixel-btn" onClick={onClose} autoFocus>
              CONTINUE
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
