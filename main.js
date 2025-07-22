async function register ({
  registerHook,
  storageManager,
  getRouter
}) {

  // API роутер для получения данных
  {
    const router = getRouter()
    
    // API endpoint для получения номера видео
    router.get('/video/:uuid/number', async (req, res) => {
      try {
        const videoUuid = req.params.uuid
        const result = await storageManager.getData('sendeverantwortung-' + videoUuid)
        
        if (!result || !result.videoNumber) {
          return res.status(404).json({ error: 'Video number not found' })
        }
        
        res.json({ videoNumber: result.videoNumber })
      } catch (err) {
        res.status(500).json({ error: err.message })
      }
    })

    // API endpoint для получения всех видео по автору
    router.get('/videos/by-author/:authorName', async (req, res) => {
      try {
        const authorName = decodeURIComponent(req.params.authorName)
        // Здесь нужно будет реализовать логику получения всех видео по автору
        // В зависимости от возможностей PeerTube API
        res.json({ message: `Videos by ${authorName} - endpoint ready for implementation` })
      } catch (err) {
        res.status(500).json({ error: err.message })
      }
    })
  }

  // Сохранение и восстановление метаданных
  {
    registerHook({
      target: 'action:api.video.updated',
      handler: ({ video, body }) => {
        const pluginData = body.pluginData
        if (!pluginData) return

        const json = {
          authorName: pluginData.authorName || '',
          videoNumber: pluginData.videoNumber || ''
        }

        // Сохраняем только если есть данные
        if (json.authorName || json.videoNumber) {
          storageManager.storeData('sendeverantwortung-' + video.uuid, json)
        }
      }
    })

    registerHook({
      target: 'filter:api.video.get.result',
      handler: async (video) => {
        if (!video) return video
        if (!video.pluginData) video.pluginData = {}

        const result = await storageManager.getData('sendeverantwortung-' + video.uuid)
        if (result) {
          Object.assign(video.pluginData, result)
        }

        return video
      }
    })
  }
}

async function unregister () {
  return
}

module.exports = {
  register,
  unregister
}
