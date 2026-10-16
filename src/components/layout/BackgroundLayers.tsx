type Props = {
  /**
   * The two pages that were captured from the live flow carry ids on the
   * background layers; the pages written by hand do not.
   */
  withIds?: boolean;
};

/** The two fixed layers every step of the flow sits on. */
export function BackgroundLayers({ withIds = false }: Props) {
  const layers = (
    <>
      <div className="app-background-holder" role="presentation" />
      <div
        className="app-background-image"
        id={withIds ? 'backgroundImage' : undefined}
        role="img"
        aria-label="Background image"
      />
    </>
  );

  if (!withIds) return layers;

  return (
    <div id="lightboxTemplateContainer">
      <div id="lightboxBackgroundContainer">{layers}</div>
    </div>
  );
}
