type CombatPhase = {
  title: string
  description: string
}

export const PHASES: Array<CombatPhase> = [
  { title: "Проверка морали", description: "Проверка морали монстров и наёмников на 2d6 <= Мораль" },
  { title: "Заготовка заклинаний", description: "Заклинатели объявляют, что они будут кастовать" },
  { title: "Подготовка изгнания нежити", description: "Жрецы объявляют, что будут изгонять нежить" },
  { title: "Инициатива", description: "Все стороны бросают d6, большие номера ходят первыми" },
  {
    title: "Движение и стрельба",
    description: "Персонажи двигаются ИЛИ стреляют из дальнобойного оружия (луки 1 раз, дротики 2 раза и т.д.)",
  },
  { title: "Ближний бой", description: "Все, кто находятся в ближнем бою на расстоянии 5 футов" },
  { title: "Заклинания", description: "Срабатывают заклинания" },
  { title: "Изгнание нежити", description: "Проверка изгнания по таблице" },
  { title: "Стрельба 2-й раз", description: "Луки стреляют 2-й раз, дротики 3-й, ЕСЛИ персонажи не двигались" },
]

export const PCOMBAT_STICKER_TAG = "⚔️"
export const PCOMBAT_DEFAULT_TITLE = "Here comes the battle"
