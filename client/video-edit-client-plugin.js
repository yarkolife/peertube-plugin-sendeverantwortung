function register ({ registerVideoField }) {
  buildFormInputs(registerVideoField)
}

export {
  register
}

function buildFormInputs (registerVideoField) {
  for (const type of [ 'upload', 'update' ]) {
    
    // Поля в основной вкладке (main tab)
    const videoFormOptions = { type, tab: 'main' }

    // Поле для имени автора (Sendeverantwortung)
    registerVideoField({
      name: 'authorName',
      label: 'Sendeverantwortung',
      descriptionHTML: 'Имя автора/ответственного за передачу',
      type: 'input'
    }, videoFormOptions)

    // Скрытое поле для номера видео (только в plugin settings)
    const pluginFormOptions = { type }
    registerVideoField({
      name: 'videoNumber',
      label: 'Номер видео',
      descriptionHTML: 'Внутренний номер видео (не отображается на фронтенде)',
      type: 'input'
    }, pluginFormOptions)
  }
}
