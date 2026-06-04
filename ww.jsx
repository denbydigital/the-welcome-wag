// Welcome Wag — extended component library (forked from the mobile UI kit, adapted for the web prototype)
// Loaded after React + Babel + Lucide. Exports atoms to window.
// All components read CSS custom properties so the Tweaks theme layer can recolour / re-shape them.

const { useState, useEffect, useRef } = React;

/* ─── Icon (Lucide) ─────────────────────────────────────────── */
function WWIcon({ name, size = 20, color = "currentColor", strokeWidth = 1.75, style }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current && window.lucide) {
      ref.current.innerHTML = "";
      const el = document.createElement("i");
      el.setAttribute("data-lucide", name);
      el.style.width = size + "px";
      el.style.height = size + "px";
      ref.current.appendChild(el);
      window.lucide.createIcons({ attrs: { stroke: color, "stroke-width": strokeWidth, width: size, height: size } });
    }
  }, [name, size, color, strokeWidth]);
  return <span ref={ref} style={{ display: "inline-flex", lineHeight: 0, color, ...style }} />;
}

/* ─── Button ────────────────────────────────────────────────── */
function WWButton({ children, variant = "primary", size = "md", icon, iconRight, onClick, full, disabled, style }) {
  const [press, setPress] = useState(false);
  const sizes = {
    sm: { padding: "8px 14px", fontSize: 13.5 },
    md: { padding: "12px 22px", fontSize: 15 },
    lg: { padding: "15px 26px", fontSize: 16.5 },
  };
  const variants = {
    primary: { background: "var(--brand)", color: "var(--paper)", boxShadow: "var(--shadow-pop)" },
    secondary: { background: "var(--cream-100)", color: "var(--ink-900)", boxShadow: "var(--shadow-xs)" },
    ghost: { background: "transparent", color: "var(--ink-900)", border: "1px solid var(--cream-300)" },
    danger: { background: "var(--coral-600)", color: "white" },
    dangerSoft: { background: "white", color: "var(--coral-700)", border: "1px solid var(--coral-300)" },
  };
  const v = variants[variant];
  const s = sizes[size];
  const disabledStyle = disabled ? { background: "var(--ink-100)", color: "var(--ink-300)", boxShadow: "none", cursor: "not-allowed" } : {};
  return (
    <button
      onClick={disabled ? undefined : onClick}
      onMouseDown={() => !disabled && setPress(true)}
      onMouseUp={() => setPress(false)}
      onMouseLeave={() => setPress(false)}
      style={{
        fontFamily: "var(--font-body)", fontWeight: 600,
        borderRadius: "var(--radius-pill)", border: v.border ? v.border : 0, cursor: "pointer",
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
        width: full ? "100%" : undefined, whiteSpace: "nowrap",
        transform: press ? "scale(0.97)" : "none",
        transition: "transform 120ms var(--ease-out), background 140ms var(--ease-out), box-shadow 140ms var(--ease-out)",
        ...s, ...v, ...disabledStyle, ...style,
      }}
    >
      {icon && <WWIcon name={icon} size={size === "lg" ? 18 : 16} />}
      {children}
      {iconRight && <WWIcon name={iconRight} size={size === "lg" ? 18 : 16} />}
    </button>
  );
}

/* ─── Card ──────────────────────────────────────────────────── */
function WWCard({ children, variant = "default", onClick, hover, style }) {
  const [hl, setHl] = useState(false);
  const variants = {
    default: { background: "var(--paper)", borderRadius: "var(--radius-lg)", padding: "var(--card-pad)", boxShadow: "var(--shadow-sm)" },
    feature: { background: "var(--paper)", borderRadius: "var(--radius-xl)", padding: "calc(var(--card-pad) + 4px)", boxShadow: "var(--shadow-md)" },
    flat: { background: "var(--cream-100)", borderRadius: "var(--radius-lg)", padding: "var(--card-pad)" },
    outline: { background: "var(--paper)", borderRadius: "var(--radius-lg)", padding: "var(--card-pad)", border: "1.5px solid var(--cream-200)" },
    urgent: { background: "var(--coral-50)", borderRadius: "var(--radius-lg)", padding: "calc(var(--card-pad) - 2px)", border: "1.5px solid var(--coral-300)" },
    honey: { background: "var(--honey-50)", borderRadius: "var(--radius-lg)", padding: "calc(var(--card-pad) - 2px)", border: "1px solid var(--honey-100)" },
    sage: { background: "var(--sage-50)", borderRadius: "var(--radius-lg)", padding: "calc(var(--card-pad) - 2px)", border: "1px solid var(--sage-100)" },
    sky: { background: "var(--sky-100)", borderRadius: "var(--radius-lg)", padding: "calc(var(--card-pad) - 2px)" },
    brand: { background: "var(--brand)", borderRadius: "var(--radius-xl)", padding: "calc(var(--card-pad) + 4px)", color: "var(--paper)", boxShadow: "var(--shadow-pop)" },
  };
  const lift = (onClick || hover) && hl ? { transform: "translateY(-2px)", boxShadow: "var(--shadow-md)" } : {};
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHl(true)}
      onMouseLeave={() => setHl(false)}
      style={{ cursor: onClick ? "pointer" : undefined, transition: "transform 160ms var(--ease-out), box-shadow 160ms var(--ease-out)", ...variants[variant], ...lift, ...style }}
    >
      {children}
    </div>
  );
}

/* ─── Badge ─────────────────────────────────────────────────── */
function WWBadge({ children, tone = "neutral", dot, icon, style }) {
  const tones = {
    neutral: { bg: "var(--cream-200)", fg: "var(--ink-700)" },
    brand: { bg: "var(--brand-tint)", fg: "var(--brand-press)" },
    honey: { bg: "var(--honey-100)", fg: "var(--honey-600)" },
    sage: { bg: "var(--sage-100)", fg: "var(--sage-700)" },
    coral: { bg: "var(--coral-100)", fg: "var(--coral-700)" },
    sky: { bg: "var(--sky-100)", fg: "var(--sky-600)" },
    paper: { bg: "rgba(255,255,255,0.16)", fg: "var(--paper)" },
  };
  const t = tones[tone];
  return (
    <span style={{
      fontSize: 12, fontWeight: 600, padding: "5px 11px", borderRadius: "var(--radius-pill)",
      background: t.bg, color: t.fg, whiteSpace: "nowrap",
      display: "inline-flex", alignItems: "center", gap: 6, lineHeight: 1.2, ...style,
    }}>
      {dot && <span style={{ width: 7, height: 7, borderRadius: 999, background: "currentColor" }} />}
      {icon && <WWIcon name={icon} size={13} />}
      {children}
    </span>
  );
}

function WWStageMarker({ stage }) { return <WWBadge tone="brand" dot>{stage}</WWBadge>; }

/* ─── Input ─────────────────────────────────────────────────── */
function WWInput({ label, value, onChange, placeholder, type = "text", help, error, suffix, prefixIcon, autoFocus, onFocus, onKeyDown }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && <label style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-900)" }}>{label}</label>}
      <div style={{
        display: "flex", alignItems: "center", gap: 8, background: "white",
        border: `1.5px solid ${error ? "var(--coral-500)" : focused ? "var(--brand)" : "var(--cream-300)"}`,
        borderRadius: "var(--radius-md)", padding: "11px 14px",
        boxShadow: focused ? `0 0 0 4px ${error ? "var(--coral-50)" : "var(--brand-tint)"}` : "none",
        transition: "all 140ms var(--ease-out)",
      }}>
        {prefixIcon && <WWIcon name={prefixIcon} size={18} color="var(--ink-500)" />}
        <input
          type={type} value={value || ""} onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder} autoFocus={autoFocus} onKeyDown={onKeyDown}
          onFocus={(e) => { setFocused(true); onFocus?.(e); }} onBlur={() => setFocused(false)}
          style={{ flex: 1, border: 0, outline: 0, background: "transparent", fontFamily: "var(--font-body)", fontSize: 16, color: "var(--ink-900)", minWidth: 0 }}
        />
        {suffix && <span style={{ fontSize: 14, color: "var(--ink-500)" }}>{suffix}</span>}
      </div>
      {error && <span style={{ fontSize: 12, color: "var(--coral-600)" }}>{error}</span>}
      {!error && help && <span style={{ fontSize: 12, color: "var(--ink-500)" }}>{help}</span>}
    </div>
  );
}

/* ─── Icon badge + list row ─────────────────────────────────── */
function WWIconBadge({ icon, tone = "brand", size = 38 }) {
  const tones = {
    brand: { bg: "var(--brand-tint)", fg: "var(--brand-press)" },
    sage: { bg: "var(--sage-100)", fg: "var(--sage-700)" },
    honey: { bg: "var(--honey-100)", fg: "var(--honey-600)" },
    coral: { bg: "var(--coral-100)", fg: "var(--coral-700)" },
    sky: { bg: "var(--sky-100)", fg: "var(--sky-600)" },
    neutral: { bg: "var(--cream-200)", fg: "var(--ink-700)" },
  };
  const t = tones[tone];
  return (
    <div style={{ width: size, height: size, borderRadius: "var(--radius-pill)", background: t.bg, color: t.fg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <WWIcon name={icon} size={size * 0.48} color={t.fg} />
    </div>
  );
}

function WWListRow({ icon, iconTone, lead, title, sub, meta, metaEl, onClick, chevron = true, last }) {
  const [hl, setHl] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHl(true)} onMouseLeave={() => setHl(false)} style={{
      display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", cursor: onClick ? "pointer" : undefined,
      borderBottom: last ? "none" : "1px solid var(--cream-200)",
      background: onClick && hl ? "var(--cream-100)" : "transparent", transition: "background 120ms var(--ease-out)",
    }}>
      {lead}
      {icon && <WWIconBadge icon={icon} tone={iconTone} />}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 15, fontWeight: 600, color: "var(--ink-900)", margin: 0 }}>{title}</p>
        {sub && <p style={{ fontSize: 13, color: "var(--ink-500)", margin: "2px 0 0" }}>{sub}</p>}
      </div>
      {metaEl}
      {meta && <span style={{ fontSize: 12, color: "var(--ink-500)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{meta}</span>}
      {chevron && <WWIcon name="chevron-right" size={18} color="var(--ink-300)" />}
    </div>
  );
}

/* ─── Source line (trust provenance) ────────────────────────── */
function WWSourceLine({ source, date, location, compact }) {
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: compact ? "10px 12px" : "12px 14px", background: "var(--cream-100)", borderRadius: "var(--radius-md)" }}>
      <WWIcon name="book-marked" size={16} color="var(--ink-500)" style={{ marginTop: 2 }} />
      <p style={{ fontSize: 12.5, color: "var(--ink-700)", margin: 0, lineHeight: 1.5 }}>
        Adapted from <strong style={{ color: "var(--ink-900)", fontWeight: 600 }}>{source}</strong>
        {date && (<>{" · "}Updated <strong style={{ color: "var(--ink-900)", fontWeight: 600 }}>{date}</strong></>)}
        {location && (<>{" · "}Relevant to <strong style={{ color: "var(--ink-900)", fontWeight: 600 }}>{location}</strong></>)}
      </p>
    </div>
  );
}

/* ─── Trust chip — source type ──────────────────────────────── */
function WWTrustChip({ type }) {
  const map = {
    vet: { tone: "sage", icon: "stethoscope", label: "Vet-reviewed" },
    ai: { tone: "sky", icon: "sparkles", label: "AI-assisted" },
    community: { tone: "honey", icon: "users", label: "Community" },
  };
  const m = map[type] || map.vet;
  return <WWBadge tone={m.tone} icon={m.icon}>{m.label}</WWBadge>;
}

/* ─── Confidence meter ──────────────────────────────────────── */
function WWConfidence({ level = "high" }) {
  const map = {
    high: { fill: 3, tone: "var(--sage-600)", bg: "var(--sage-100)", label: "High confidence" },
    medium: { fill: 2, tone: "var(--honey-600)", bg: "var(--honey-100)", label: "Medium confidence" },
    caution: { fill: 1, tone: "var(--coral-600)", bg: "var(--coral-100)", label: "Treat with caution" },
  };
  const m = map[level] || map.high;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12.5, fontWeight: 600, color: m.tone, background: m.bg, padding: "5px 11px", borderRadius: "var(--radius-pill)" }}>
      <span style={{ display: "inline-flex", gap: 2, alignItems: "flex-end" }}>
        {[1, 2, 3].map((i) => (
          <span key={i} style={{ width: 4, height: 4 + i * 3, borderRadius: 2, background: i <= m.fill ? m.tone : "color-mix(in oklab, currentColor 22%, transparent)" }} />
        ))}
      </span>
      {m.label}
    </span>
  );
}

/* ─── Avatar (dog photo placeholder) ────────────────────────── */
function WWAvatar({ name = "Cooper", size = 56, initial, tone }) {
  const init = (initial || name[0] || "?").toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: "var(--radius-pill)",
      background: tone || "linear-gradient(140deg, var(--terracotta-300), var(--brand))",
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "var(--paper)", fontFamily: "var(--font-display)", fontWeight: 600,
      fontSize: size * 0.42, boxShadow: "var(--shadow-sm)", flexShrink: 0, position: "relative", overflow: "hidden",
    }}>{init}</div>
  );
}

/* ─── Section header ────────────────────────────────────────── */
function WWSection({ title, action, onAction, style }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "0 4px 10px", ...style }}>
      <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, margin: 0, color: "var(--ink-900)" }}>{title}</h3>
      {action && <button onClick={onAction} style={{ border: 0, background: "transparent", color: "var(--brand-hover)", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>{action}</button>}
    </div>
  );
}

/* ─── Screen header ─────────────────────────────────────────── */
function WWHeader({ title, subtitle, onBack, action }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 20px 16px" }}>
      {onBack && (
        <button onClick={onBack} style={{ width: 38, height: 38, borderRadius: "var(--radius-pill)", border: 0, background: "var(--paper)", boxShadow: "var(--shadow-xs)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--ink-900)", flexShrink: 0 }}>
          <WWIcon name="arrow-left" size={18} />
        </button>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        {subtitle && <div className="eyebrow" style={{ marginBottom: 2 }}>{subtitle}</div>}
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 27, fontWeight: 600, letterSpacing: "-0.02em", color: "var(--ink-900)", margin: 0, lineHeight: 1.1 }}>{title}</h1>
      </div>
      {action}
    </div>
  );
}

/* ─── Verdict pill (food guide) ─────────────────────────────── */
function WWVerdict({ verdict, size = "md" }) {
  const map = {
    safe: { bg: "var(--sage-100)", fg: "var(--sage-700)", icon: "circle-check", label: "Safe" },
    caution: { bg: "var(--honey-100)", fg: "var(--honey-600)", icon: "circle-alert", label: "In moderation" },
    unsafe: { bg: "var(--coral-100)", fg: "var(--coral-700)", icon: "circle-x", label: "Never" },
  };
  const m = map[verdict] || map.safe;
  const sm = size === "sm";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: m.bg, color: m.fg, fontWeight: 600, fontSize: sm ? 12 : 13.5, padding: sm ? "4px 10px" : "6px 13px", borderRadius: "var(--radius-pill)" }}>
      <WWIcon name={m.icon} size={sm ? 14 : 16} color={m.fg} strokeWidth={2} />{m.label}
    </span>
  );
}

/* ─── Toast ─────────────────────────────────────────────────── */
function WWToast({ show, icon = "check", children }) {
  return (
    <div style={{
      position: "absolute", left: "50%", bottom: 104, transform: `translateX(-50%) translateY(${show ? 0 : 16}px)`,
      opacity: show ? 1 : 0, pointerEvents: "none", transition: "all 280ms var(--ease-spring)", zIndex: 60,
      display: "flex", alignItems: "center", gap: 10, background: "var(--ink-900)", color: "var(--paper)",
      padding: "12px 18px", borderRadius: "var(--radius-pill)", boxShadow: "var(--shadow-lg)", fontSize: 14, fontWeight: 600, whiteSpace: "nowrap",
    }}>
      <WWIcon name={icon} size={17} color="var(--sage-300)" strokeWidth={2.2} />{children}
    </div>
  );
}

Object.assign(window, {
  WWIcon, WWButton, WWCard, WWBadge, WWStageMarker, WWInput, WWIconBadge, WWListRow,
  WWSourceLine, WWTrustChip, WWConfidence, WWAvatar, WWSection, WWHeader, WWVerdict, WWToast,
});
