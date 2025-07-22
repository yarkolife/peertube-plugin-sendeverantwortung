function register ({ registerHook, peertubeHelpers }) {

  registerHook({
    target: 'filter:video-watch.video-plugin-metadata.result',

    handler: async (metadata, { video }) => {
      const pluginData = video.pluginData
      
      // Показываем только поле с именем автора
      if (!pluginData?.authorName) return metadata

      // Создаем ссылку для группировки видео по автору
      const authorUrl = `/videos/search?search=${encodeURIComponent(pluginData.authorName)}&searchTarget=local`

      // Добавляем метаданные в начало списка (чтобы было выше)
      metadata.unshift({
        label: 'Sendeverantwortung',
        safeHTML: `<a href="${authorUrl}">${pluginData.authorName}</a>`
      })

      return metadata
    }
  })

  // Дополнительный хук для более высокого размещения (если поддерживается)
  registerHook({
    target: 'action:video-watch.video.loaded',
    handler: ({ video }) => {
      // Можно добавить дополнительную логику для размещения информации
      // непосредственно под видео, если PeerTube это поддерживает
      console.log('Video loaded with author:', video.pluginData?.authorName)
    }
  })
}

export {
  register
}
