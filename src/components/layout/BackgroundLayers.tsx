/** The two fixed layers every step of the flow sits on. */
export function BackgroundLayers() {
  return (
    <>
      <div className="app-background-holder" role="presentation" />
      <div className="app-background-image" role="img" aria-label="Background image" />
    </>
  );
}
