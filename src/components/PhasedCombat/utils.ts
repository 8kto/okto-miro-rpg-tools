import type { StickyNote } from "@mirohq/websdk-types/stable/features/widgets/stickyNote"
import type { Tag } from "@mirohq/websdk-types/stable/features/widgets/tag"
import { PCOMBAT_DEFAULT_TITLE, PCOMBAT_STICKER_TAG, PHASES } from "./consts"

const { board } = miro

const getStickerSide = async () => {
  const viewport = await board.viewport.get()

  const screenWidthPx = viewport.width
  const stickyBoardWidth = screenWidthPx * 0.05

  return Math.min(stickyBoardWidth, 2000)
}

const getCombatSticker = async (): Promise<StickyNote | null> => {
  const existingStickers = await board.get({
    type: "sticky_note",
    tags: [PCOMBAT_STICKER_TAG],
  })

  if (existingStickers.length) {
    return existingStickers[0]
  }

  return null
}

const getCombatTag = async (): Promise<Tag | null> => {
  const existingTags = (await board.get({ type: "tag" })).filter((t) => t.title === PCOMBAT_STICKER_TAG)

  if (existingTags.length) {
    return existingTags[0]
  }

  return null
}

const getCenterCoords = async () => {
  const viewport = await board.viewport.get()
  const x = viewport.x + viewport.width / 2
  const y = viewport.y + viewport.height / 2

  return { x, y }
}

export const createSticker = async (): Promise<StickyNote> => {
  const { x, y } = await getCenterCoords()
  const existingSticker = await getCombatSticker()

  if (existingSticker) {
    await miro.board.select({ id: existingSticker.id })

    return existingSticker
  }

  const existingTag = await getCombatTag()
  let tag
  if (existingTag) {
    tag = existingTag
  } else {
    tag = await miro.board.createTag({
      title: PCOMBAT_STICKER_TAG,
      color: "blue",
    })
  }

  // Create a new sticker
  const sticker = await board.createStickyNote({
    content: PCOMBAT_DEFAULT_TITLE,
    shape: "rectangle",
    x,
    y,
    width: await getStickerSide(),
    tagIds: [tag.id],
    style: {
      fillColor: "light_green",
      textAlign: "center",
      textAlignVertical: "middle",
    },
  })

  await sticker.sync()
  await miro.board.select({ id: sticker.id })
  await miro.board.viewport.setZoom(0.1)

  console.debug("Sticker created:", await miro.board.getById(sticker.id))

  return sticker
}

export const updateStickerText = async (text: string) => {
  const sticker = await getCombatSticker()

  if (!sticker) {
    console.warn("No extension sticker found to update.")

    return
  }
  sticker.content = text

  await sticker.sync()
}

export const getPhaseTitle = (roundNum: number, phaseIndex: number): string => {
  return `R${roundNum}: ${PHASES[phaseIndex].title}`
}
