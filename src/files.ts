export abstract class DoboidFileSpace {}

export class EmptyFileSpace extends DoboidFileSpace {}

export class AllocatedFileSpace extends DoboidFileSpace {
  public readonly src: string;
  public readonly meta: File;

  constructor(dataUrl: string | ArrayBuffer, meta: File) {
    super();

    if (dataUrl instanceof ArrayBuffer) {
      this.src = dataUrl.toString();
    } else {
      this.src = dataUrl;
    }

    this.meta = meta;
  }
}

export function isDoboidSpace(space: unknown): space is DoboidFileSpace {
  return space instanceof DoboidFileSpace;
}

export function isSpaceEmpty(space: DoboidFileSpace): space is EmptyFileSpace {
  return space instanceof EmptyFileSpace;
}

export function isSpaceAllocated(space: DoboidFileSpace): space is AllocatedFileSpace {
  return space instanceof AllocatedFileSpace;
}
