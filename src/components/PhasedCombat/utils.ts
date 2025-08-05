import type { StickyNote } from "@mirohq/websdk-types/stable/features/widgets/stickyNote"
import type { Tag } from "@mirohq/websdk-types/stable/features/widgets/tag"
import { PHASES } from "./consts"

const { board } = miro

export const PCOMBAT_STICKER_TAG = "phasedCombatTag"
export const PCOMBAT_DEFAULT_TITLE = "Here comes the battle"

const getStickerSide = async () => {
  const viewport = await board.viewport.get() // contains width, height, x, y

  const screenWidthPx = viewport.width
  const stickyBoardWidth = screenWidthPx * 0.05

  return Math.min(stickyBoardWidth, 1500)
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

export const createSticker = async () => {
  // Get the current viewport to determine the center position
  const viewport = await board.viewport.get()
  const centerX = viewport.x + viewport.width / 2
  const centerY = viewport.y + viewport.height / 2

  const existingSticker = await getCombatSticker()

  if (existingSticker) {
    await miro.board.select({ id: existingSticker.id })

    return
  }

  const existingTag = await getCombatTag()
  let tag
  if (existingTag) {
    tag = existingTag
  } else {
    tag = await miro.board.createTag({
      title: PCOMBAT_STICKER_TAG,
    })
  }

  // Create a new sticker
  const sticker = await board.createStickyNote({
    content: PCOMBAT_DEFAULT_TITLE,
    shape: "rectangle",
    x: centerX,
    y: centerY,
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
