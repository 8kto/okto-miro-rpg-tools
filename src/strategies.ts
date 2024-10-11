import { GroupableItem } from '@mirohq/websdk-types/stable/features/widgets/group'

const { board } = miro

export const useBlocksRowStrategy = async ({
  x,
  y,
  width,
  n = 8,
}: {
  x: number;
  y: number;
  n: number;
  width: number;
}): Promise<GroupableItem[]> => {
  const MAGIC_BOTTOM_OFFSET = y + 72;
  const MAGIC_LEFT_OFFSET = x - width / 2.5;
  const MAGIC_OFFSET_STEP = 15;

  // Create 'x' texts in parallel
  const hpTextPromises = Array.from({ length: n }, (_, i) =>
    board.createText({
      content: 'x',
      x: MAGIC_LEFT_OFFSET + i * MAGIC_OFFSET_STEP,
      y: MAGIC_BOTTOM_OFFSET,
      width: 1,
      style: {
        textAlign: 'center',
        fontSize: 14,
        fillColor: '#000',
        color: '#fff',
      },
    })
  );

  // Create ' ' texts in parallel
  const spaceTextPromises = Array.from({ length: n }, (_, i) =>
    board.createText({
      content: ' ',
      x: MAGIC_LEFT_OFFSET + i * MAGIC_OFFSET_STEP,
      y: MAGIC_BOTTOM_OFFSET,
      width: 1,
      style: {
        textAlign: 'left',
        fontSize: 14,
        fillColor: '#fff',
        color: '#000',
      },
    })
  );

  // Execute all promises in parallel and wait for completion
  const [hpTexts, spaceTexts] = await Promise.all([
    Promise.all(hpTextPromises),
    Promise.all(spaceTextPromises),
  ]);

  return hpTexts.concat(spaceTexts);
};