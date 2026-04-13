import { useRef, useState } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { toPng } from "html-to-image"
import { QRCodeSVG } from "qrcode.react"
import "../styles/IdCardPreview.css"

function IdCardPreview({ studentData }) {
  const cardRef = useRef(null)
  const dragRef = useRef({ dragging: false, startX: 0, startRotation: 0, moved: false })
  const [rotationY, setRotationY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [transitionEnabled, setTransitionEnabled] = useState(true)

  const detailLabel = studentData.mode === "professional" ? "Designation" : "Class / Division"
  const detailValue = studentData.mode === "professional" ? studentData.designation : studentData.classDivision
  const cardTypeTitle = studentData.mode === "professional" ? "Official Professional Identity Card" : "Official Student Identity Card"
  const displayId = studentData.idNumber.trim() || "Auto on Generate"
  const displayIssueDate = studentData.issueDate || "Not specified"
  const displayExpiry = studentData.expiryDate || "Not specified"
  const displayAddress = studentData.address.trim() || "Not provided"
  const displayAdditional = studentData.additionalDetails.trim() || "No additional details"
  const displayStatus = studentData.expiryDate ? (new Date(studentData.expiryDate) >= new Date() ? "Active" : "Expired") : "Active"
  const qrCompactPayload = [
    `Name: ${studentData.name || "N/A"}`,
    `ID: ${displayId}`,
    `${detailLabel}: ${detailValue || "N/A"}`,
    `Expiry: ${displayExpiry}`,
    `Status: ${displayStatus}`,
  ].join(" | ")

  const hasRequiredData =
    studentData.name.trim() &&
    detailValue &&
    studentData.organizationName.trim() &&
    studentData.photoPreview

  const verificationPayload = [
    `Name: ${studentData.name || "N/A"}`,
    `ID: ${displayId}`,
    `${detailLabel}: ${detailValue || "N/A"}`,
    `Expiry: ${displayExpiry}`,
    `Status: ${displayStatus}`,
  ].join("\n")

  const qrMarkup = renderToStaticMarkup(
    <QRCodeSVG value={qrCompactPayload} size={160} bgColor="#ffffff" fgColor="#0f172a" level="M" includeMargin />,
  )

  const escapeHtml = (value) =>
    String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;")

  const clampRotation = (value) => {
    if (value > 180) return 180
    if (value < -180) return -180
    return value
  }

  const getClientX = (event) => {
    if (event.touches?.length) {
      return event.touches[0].clientX
    }
    if (event.changedTouches?.length) {
      return event.changedTouches[0].clientX
    }
    return event.clientX
  }

  const startDrag = (clientX) => {
    setIsDragging(true)
    setTransitionEnabled(false)
    dragRef.current = {
      dragging: true,
      startX: clientX,
      startRotation: rotationY,
      moved: false,
    }
  }

  const updateDrag = (clientX) => {
    if (!dragRef.current.dragging) {
      return
    }

    // Drag distance is translated into Y rotation for direct card control.
    const delta = clientX - dragRef.current.startX
    if (Math.abs(delta) > 3) {
      dragRef.current.moved = true
    }

    const sensitivity = 0.9
    const nextRotation = dragRef.current.startRotation + delta * sensitivity
    setRotationY(clampRotation(nextRotation))
  }

  const endDrag = () => {
    if (!dragRef.current.dragging) {
      return
    }

    dragRef.current.dragging = false
    setIsDragging(false)
    setTransitionEnabled(true)

    // Snap to the nearest face when drag ends.
    const snapped = Math.abs(rotationY) > 90 ? (rotationY >= 0 ? 180 : -180) : 0
    setRotationY(snapped)
  }

  const handleCardClick = () => {
    if (dragRef.current.moved) {
      dragRef.current.moved = false
      return
    }

    setTransitionEnabled(true)
    setRotationY((prev) => (Math.abs(prev) > 90 ? 0 : 180))
  }

  const handleMouseDown = (event) => {
    startDrag(getClientX(event))
  }

  const handleMouseMove = (event) => {
    updateDrag(getClientX(event))
  }

  const handleTouchStart = (event) => {
    startDrag(getClientX(event))
  }

  const handleTouchMove = (event) => {
    if (dragRef.current.dragging) {
      event.preventDefault()
    }
    updateDrag(getClientX(event))
  }

  const handleDownload = async () => {
    if (!cardRef.current || !hasRequiredData) {
      return
    }

    try {
      const targetRotation = Math.abs(rotationY) > 90 ? 0 : 180
      setTransitionEnabled(true)
      setRotationY(targetRotation)

      // Let the flip animation finish before exporting the visible side.
      await new Promise((resolve) => setTimeout(resolve, 760))

      const image = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2.2,
      })

      const link = document.createElement("a")
      link.href = image
      link.download = `${studentData.name.replace(/\s+/g, "-")}-${displayId}.png`
      link.rel = "noopener"
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      console.error("Unable to export ID card", error)
    }
  }

  const handleDownloadFlippableHtml = async () => {
    if (!hasRequiredData) {
      return
    }

    const detailValueText = detailValue || "-"
    const fileMarkup = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Flippable ID Card</title>
  <style>
    body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: radial-gradient(circle at 15% 18%, #1e3a8a, #0b1427 35%, #050a15 100%); font-family: Segoe UI, Arial, sans-serif; }
    .scene { width: min(92vw, 390px); perspective: 1400px; }
    .inner { position: relative; min-height: 560px; transform-style: preserve-3d; transition: transform 0.7s cubic-bezier(.2,.75,.2,1); }
    .inner.flipped { transform: rotateY(180deg); }
    .face { position: absolute; inset: 0; border-radius: 22px; overflow: hidden; border: 1px solid #1f3d7a; background: #f9fbff; box-shadow: 0 22px 34px rgba(10,23,54,.28); backface-visibility: hidden; display: flex; flex-direction: column; }
    .back { transform: rotateY(180deg); }
    .top { padding: 1rem 1.1rem; background: linear-gradient(135deg, #0f1f45, #1d4ed8 72%, #2563eb 100%); color: #e6f0ff; }
    .brand { display: flex; gap: .7rem; align-items: center; }
    .logo { width: 52px; height: 52px; border-radius: 14px; overflow: hidden; background: rgba(255,255,255,.2); border: 1px solid rgba(219,234,254,.45); display: grid; place-items: center; }
    .logo img { width: 100%; height: 100%; object-fit: contain; background: #f8fbff; }
    .school { margin: 0; font-size: 1rem; font-weight: 700; }
    .sub { margin: .2rem 0 0; font-size: .74rem; text-transform: uppercase; letter-spacing: .08em; color: #bfdbfe; }
    .body { flex: 1; min-height: 0; display: grid; grid-template-columns: 118px 1fr; gap: .85rem; padding: 1rem 1.1rem; }
    .media { display: flex; flex-direction: column; align-items: center; gap: .55rem; }
    .photo { width: 100%; aspect-ratio: 1/1; border-radius: 16px; overflow: hidden; border: 2px solid #d9e8ff; background: #eaf2ff; }
    .photo img { width: 100%; height: 100%; object-fit: cover; }
    .qr { width: 100%; max-width: 118px; border: 1px solid #dbe7fb; border-radius: 12px; padding: .35rem .35rem .45rem; text-align: center; background: #f8fbff; }
    .qr svg { width: 100%; height: auto; display: block; border-radius: 10px; }
    .qr span { display: block; margin-top: .2rem; font-size: .68rem; font-weight: 600; color: #334155; }
    .details p { margin: 0; }
    .label { font-size: .69rem; text-transform: uppercase; letter-spacing: .07em; color: #64748b; margin-bottom: .12rem; }
    .value { font-size: .94rem; color: #0f172a; font-weight: 700; margin-bottom: .54rem; word-break: break-word; }
    .back-content { flex: 1; min-height: 0; padding: .9rem 1rem; display: flex; flex-direction: column; gap: .65rem; }
    .row { border: 1px solid #dbe7fb; border-radius: 12px; padding: .5rem .62rem; background: linear-gradient(180deg, #fcfeff, #f1f6ff); }
    .row .label { font-size: .68rem; font-weight: 700; margin: 0; }
    .row .value { margin: .2rem 0 0; font-size: .8rem; line-height: 1.35; font-weight: 600; }
    .split { display: grid; grid-template-columns: 1fr 1fr; gap: .7rem; }
    .footer { display: flex; justify-content: space-between; align-items: center; padding: .7rem 1.1rem; border-top: 1px solid #d6e5fb; color: #1e3a8a; font-size: .72rem; font-weight: 700; background: linear-gradient(180deg, #eff6ff, #e5edff); }
    .actions { display: flex; justify-content: center; margin-top: 12px; }
    button { border: 0; border-radius: 12px; padding: .75rem 1rem; font-weight: 700; color: #f8fbff; background: #0f2348; cursor: pointer; }
    @media (max-width: 520px) { .inner { min-height: 600px; } .body { grid-template-columns: 1fr; } .photo, .qr { max-width: 130px; } .split { grid-template-columns: 1fr; } }
  </style>
</head>
<body>
  <div>
    <div class="scene" id="scene">
      <div class="inner" id="inner">
        <article class="face front">
          <div class="top">
            <div class="brand">
              <div class="logo">${studentData.logoPreview ? `<img src="${studentData.logoPreview}" alt="Logo" />` : "LOGO"}</div>
              <div>
                <p class="school">${escapeHtml(studentData.organizationName || "Organization / School")}</p>
                <p class="sub">${escapeHtml(cardTypeTitle)}</p>
              </div>
            </div>
          </div>
          <div class="body">
            <div class="media">
              <div class="photo"><img src="${studentData.photoPreview}" alt="Photo" /></div>
              <div class="qr">
                ${qrMarkup}
                <span>Scan to verify</span>
              </div>
            </div>
            <div class="details">
              <p class="label">Name</p><p class="value">${escapeHtml(studentData.name || "-")}</p>
              <p class="label">${escapeHtml(detailLabel)}</p><p class="value">${escapeHtml(detailValueText)}</p>
              <p class="label">ID Number</p><p class="value">${escapeHtml(displayId)}</p>
            </div>
          </div>
          <div class="footer"><span>Front Side</span><span>Tap to flip</span></div>
        </article>

        <article class="face back">
          <div class="top">
            <p class="school">${escapeHtml(studentData.organizationName || "Organization / School")}</p>
            <p class="sub">Card Back Side</p>
          </div>
          <div class="back-content">
            <div class="row"><p class="label">Address</p><p class="value">${escapeHtml(displayAddress)}</p></div>
            <div class="split">
              <div class="row"><p class="label">Date of Issue</p><p class="value">${escapeHtml(displayIssueDate)}</p></div>
              <div class="row"><p class="label">Expiry Date</p><p class="value">${escapeHtml(displayExpiry)}</p></div>
            </div>
            <div class="row"><p class="label">Status</p><p class="value">${escapeHtml(displayStatus)}</p></div>
            <div class="row"><p class="label">Additional Details</p><p class="value">${escapeHtml(displayAdditional)}</p></div>
          </div>
          <div class="footer"><span>Back Side</span><span>FRAAS Secure Identity</span></div>
        </article>
      </div>
    </div>
    <div class="actions"><button id="flipBtn" type="button">Flip Card</button></div>
  </div>

  <script>
    const inner = document.getElementById('inner');
    const scene = document.getElementById('scene');
    const flipBtn = document.getElementById('flipBtn');
    const toggle = () => inner.classList.toggle('flipped');
    scene.addEventListener('click', toggle);
    flipBtn.addEventListener('click', (e) => { e.stopPropagation(); toggle(); });
  </script>
</body>
</html>`

    const fileName = `${studentData.name.replace(/\s+/g, "-")}-${displayId}-flippable.html`
    const blob = new Blob([fileMarkup], { type: "text/html;charset=utf-8" })

    if (window.showSaveFilePicker) {
      try {
        const handle = await window.showSaveFilePicker({
          suggestedName: fileName,
          types: [
            {
              description: "HTML File",
              accept: { "text/html": [".html"] },
            },
          ],
        })
        const writable = await handle.createWritable()
        await writable.write(blob)
        await writable.close()
        return
      } catch (error) {
        if (error?.name !== "AbortError") {
          console.error("Native save dialog failed, using fallback download.", error)
        } else {
          return
        }
      }
    }

    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = fileName
    link.rel = "noopener"
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 4000)
  }

  const depthFactor = Math.abs(rotationY) / 180
  const dynamicShadow = `0 ${18 + depthFactor * 12}px ${34 + depthFactor * 18}px rgba(10, 23, 54, ${0.22 + depthFactor * 0.16})`

  return (
    <div className="id-card-preview">
      <div className="preview-stage">
        <div
          ref={cardRef}
          className={isDragging ? "flip-scene dragging" : "flip-scene"}
          style={{ boxShadow: dynamicShadow }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={endDrag}
          onMouseLeave={endDrag}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={endDrag}
          onClick={handleCardClick}
          role="button"
          tabIndex={0}
          aria-label="Flip ID card preview"
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault()
              setTransitionEnabled(true)
              setRotationY((prev) => (Math.abs(prev) > 90 ? 0 : 180))
            }
          }}
        >
          <div
            className={transitionEnabled ? "flip-inner" : "flip-inner drag-active"}
            style={{ transform: `rotateY(${rotationY}deg)` }}
          >
            <article className="premium-id-card card-face card-front">
              <div className="card-top">
                <div className="brand-row">
                  <div className="logo-chip">
                    {studentData.logoPreview ? (
                      <img src={studentData.logoPreview} alt="Organization logo" />
                    ) : (
                      <span>LOGO</span>
                    )}
                  </div>
                  <div>
                    <p className="school-name">{studentData.organizationName || "Organization / School"}</p>
                    <p className="card-subtitle">{cardTypeTitle}</p>
                  </div>
                </div>
              </div>

              <div className="card-body">
                <div className="media-column">
                  <div className="photo-wrap">
                    {studentData.photoPreview ? (
                      <img src={studentData.photoPreview} alt="Person" />
                    ) : (
                      <div className="photo-placeholder">Photo</div>
                    )}
                  </div>

                  <div className="qr-wrap qr-under-photo" aria-label="Verification QR">
                    <QRCodeSVG value={qrCompactPayload} size={80} bgColor="#ffffff" fgColor="#0f172a" level="M" includeMargin />
                    <p>Scan to verify</p>
                  </div>
                </div>

                <div className="student-details">
                  <p className="detail-label">Name</p>
                  <p className="detail-value">{studentData.name || "-"}</p>

                  <p className="detail-label">{detailLabel}</p>
                  <p className="detail-value">{detailValue || "-"}</p>

                  <p className="detail-label">ID Number</p>
                  <p className="detail-value">{displayId}</p>
                </div>
              </div>

              <div className="card-footer">
                <span>Front Side</span>
                <span>{isDragging ? "Drag to rotate" : "Tap or drag to flip"}</span>
              </div>
            </article>

            <article className="premium-id-card card-face card-back">
              <div className="card-top back-head">
                <p className="school-name">{studentData.organizationName || "Organization / School"}</p>
                <p className="card-subtitle">Card Back Side</p>
              </div>

              <div className="back-content">
                <div className="back-row">
                  <span>Address</span>
                  <p>{displayAddress}</p>
                </div>
                <div className="back-row split">
                  <div>
                    <span>Date of Issue</span>
                    <p>{displayIssueDate}</p>
                  </div>
                  <div>
                    <span>Expiry Date</span>
                    <p>{displayExpiry}</p>
                  </div>
                </div>
                <div className="back-row">
                  <span>Status</span>
                  <p>{displayStatus}</p>
                </div>
                <div className="back-row">
                  <span>Additional Details</span>
                  <p>{displayAdditional}</p>
                </div>
              </div>

              <div className="card-footer">
                <span>Back Side</span>
                <span>FRAAS Secure Identity</span>
              </div>
            </article>
          </div>
          <div className="rotation-gloss" aria-hidden="true" />
        </div>
      </div>

      <button
        className="flip-btn"
        onClick={() => {
          setTransitionEnabled(true)
          setRotationY((prev) => (Math.abs(prev) > 90 ? 0 : 180))
        }}
        type="button"
      >
        Flip Card
      </button>

      <button className="download-btn" onClick={handleDownload} disabled={!hasRequiredData}>
        Download as PNG
      </button>

      <button className="download-html-btn" onClick={handleDownloadFlippableHtml} disabled={!hasRequiredData}>
        Download Flippable HTML
      </button>
      {!hasRequiredData && <p className="helper-text">Complete all fields to enable download.</p>}
    </div>
  )
}

export default IdCardPreview
