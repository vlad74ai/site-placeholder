export const nodeMinLevels = {
  FEEDBACK_CONTROL: 'explorer',
  SLIDE9_WORK_MODEL: 'explorer',
  SKILLS_MAP: 'explorer',
  PROCESS_IMPROVEMENT: 'practitioner',
  AUTOMATION: 'practitioner'
};

export const blockMinLevels = {
  AI_MECHANICS: {
    'mechanics-generation': 'explorer'
  },
  TASK_CONTEXT: {
    'next-fact': 'explorer'
  }
};

export const blockTextByLevel = {
  beginner: {
    'AI_MECHANICS.mechanics-gap-explanation': 'Для человека это одна конкретная ситуация. Для ИИ — только та её часть, которую вы сообщили, показали или к которой дали доступ. Неизвестные детали он не может учитывать как надёжные факты.',
    'TASK_CONTEXT.delivery-explanation': 'В первом случае ИИ может только перечислять типичные причины. Во втором он уже может сузить круг возможных причин и предложить, что проверить сначала.',
    'TASK_CONTEXT.context-core': 'Нужные факты помогают ИИ меньше гадать. Но даже хороший набор фактов ещё не доказывает, что первая найденная причина верна.',
    'VERIFY_RESULT.verification-example': 'Например, ИИ может уверенно назвать дату, цену, правило или причину, которых не было в ваших данных, потому что выбрал правдоподобный вариант. Перед важным решением такой факт нужно проверить.'
  }
};
