// Welcome Wag — tool screens: Shopping, Food guide, Behaviour, Vet visit, Routine, Urgent sheet.
const { useState: useStateT, useMemo } = React;
const D = window.WW_DATA;

/* small flag control reused across guidance surfaces */
function FlagControl({ onFlag, flagged }) {
  return (
    <button onClick={onFlag} style={{
      display: "inline-flex", alignItems: "center", gap: 7, border: "1px solid var(--cream-300)",
      background: flagged ? "var(--coral-50)" : "transparent", color: flagged ? "var(--coral-700)" : "var(--ink-500)",
      borderColor: flagged ? "var(--coral-300)" : "var(--cream-300)",
      padding: "8px 14px", borderRadius: "var(--radius-pill)", fontSize: 13, fontWeight: 600, cursor: "pointer",
    }}>
      <WWIcon name={flagged ? "flag" : "flag"} size={15} />{flagged ? "Flagged — thank you" : "Flag this advice"}
    </button>
  );
}

function Disclaimer({ children }) {
  return (
    <p style={{ fontSize: 12, color: "var(--ink-500)", textAlign: "center", margin: "4px 0 0", lineHeight: 1.5 }}>
      {children || <>This is general guidance, not medical advice. For urgent concerns, <span style={{ color: "var(--coral-600)", fontWeight: 600 }}>call your vet</span>.</>}
    </p>
  );
}

/* ═══ SHOPPING CHECKLIST ═══════════════════════════════════════ */
function ShoppingScreen({ dog, tabBar, onBack, onToast }) {
  const [have, setHave] = useStateT(() => { const s = {}; D.WW_SHOPPING.forEach((c, ci) => c.items.forEach((it, i) => { if (it.have) s[ci + "-" + i] = true; })); return s; });
  const total = D.WW_SHOPPING.reduce((n, c) => n + c.items.length, 0);
  const got = Object.values(have).filter(Boolean).length;
  const urgency = { now: { tone: "coral", label: "Get now" }, soon: { tone: "honey", label: "Buy soon" }, nice: { tone: "neutral", label: "Nice to have" } };

  return (
    <WWScreen tabBar={tabBar}>
      <WWHeader onBack={onBack} subtitle={`For ${dog.name} · ${dog.suburb}`} title="Day-one shopping" action={
        <button onClick={() => onToast("Checklist shared")} style={{ width: 38, height: 38, borderRadius: "var(--radius-pill)", border: 0, background: "var(--paper)", boxShadow: "var(--shadow-xs)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--ink-900)" }}>
          <WWIcon name="share-2" size={17} />
        </button>
      } />
      <div style={{ padding: "0 20px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
        <WWCard variant="sage" style={{ padding: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 600, fontSize: 14.5, color: "var(--ink-900)", margin: 0 }}>{got} of {total} sorted</p>
              <p style={{ fontSize: 13, color: "var(--ink-700)", margin: "2px 0 0" }}>Check off what you already have.</p>
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 600, color: "var(--sage-700)" }}>{Math.round(got / total * 100)}%</div>
          </div>
          <div style={{ height: 7, borderRadius: 999, background: "var(--sage-100)", overflow: "hidden", marginTop: 12 }}>
            <div style={{ width: (got / total * 100) + "%", height: "100%", background: "var(--sage-500)", borderRadius: 999, transition: "width 280ms var(--ease-out)" }} />
          </div>
        </WWCard>

        {D.WW_SHOPPING.map((cat, ci) => (
          <div key={ci}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "0 4px 10px" }}>
              <WWIconBadge icon={cat.icon} tone="brand" size={30} />
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 600, margin: 0 }}>{cat.cat}</h3>
            </div>
            <WWCard variant="default" style={{ padding: 6 }}>
              {cat.items.map((it, i) => {
                const key = ci + "-" + i; const on = have[key]; const u = urgency[it.urgency];
                return (
                  <div key={i} style={{ display: "flex", gap: 12, padding: "12px 12px", borderBottom: i === cat.items.length - 1 ? "none" : "1px solid var(--cream-200)" }}>
                    <button onClick={() => setHave({ ...have, [key]: !on })} style={{
                      width: 24, height: 24, borderRadius: 8, marginTop: 2, flexShrink: 0, cursor: "pointer",
                      border: on ? 0 : "1.6px solid var(--cream-300)", background: on ? "var(--sage-500)" : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>{on && <WWIcon name="check" size={14} color="white" strokeWidth={2.6} />}</button>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 8, justifyContent: "space-between" }}>
                        <p style={{ fontSize: 14.5, fontWeight: 600, color: on ? "var(--ink-500)" : "var(--ink-900)", margin: 0, textDecoration: on ? "line-through" : "none" }}>{it.name}</p>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-700)", whiteSpace: "nowrap" }}>{it.price}</span>
                      </div>
                      <p style={{ fontSize: 12.5, color: "var(--ink-500)", margin: "3px 0 8px", lineHeight: 1.45 }}>{it.why}</p>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                        <WWBadge tone={u.tone}>{u.label}</WWBadge>
                        <WWBadge tone="neutral" icon="tag">{it.brand.trim()}</WWBadge>
                      </div>
                    </div>
                  </div>
                );
              })}
            </WWCard>
          </div>
        ))}

        <WWCard variant="flat" style={{ padding: 14 }}>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <WWIcon name="info" size={16} color="var(--ink-500)" style={{ marginTop: 2 }} />
            <p style={{ fontSize: 12.5, color: "var(--ink-700)", margin: 0, lineHeight: 1.5 }}>
              Brand suggestions are Australian-available and <strong>community-sourced</strong> — prices are a guide only, not live. We never recommend a product not sold locally.
            </p>
          </div>
        </WWCard>
        <Disclaimer>Quantities suit an {dog.age} {dog.breed}. Always check product age-suitability before buying.</Disclaimer>
      </div>
    </WWScreen>
  );
}

/* ═══ FOOD GUIDE ═══════════════════════════════════════════════ */
function FoodScreen({ dog, tabBar, onBack }) {
  const [q, setQ] = useStateT("");
  const [filter, setFilter] = useStateT("All");
  const [open, setOpen] = useStateT(null);
  const [flagged, setFlagged] = useStateT(false);
  const cats = ["All", "Fruit", "Vegetables", "Meat", "Dairy", "Pantry"];
  const results = useMemo(() => D.WW_FOODS.filter((f) =>
    (filter === "All" || f.cat === filter) && f.name.toLowerCase().includes(q.toLowerCase())), [q, filter]);
  const noMatch = q.trim().length > 1 && results.length === 0;

  if (open) {
    const f = open;
    return (
      <WWScreen tabBar={tabBar}>
        <WWHeader onBack={() => { setOpen(null); setFlagged(false); }} subtitle={`Food guide · ${f.cat}`} title={f.name} />
        <div style={{ padding: "0 20px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <WWVerdict verdict={f.verdict} />
            {f.severity === "high" && <WWBadge tone="coral" icon="alert-triangle">Toxic</WWBadge>}
            <WWConfidence level={f.conf} />
          </div>
          <p style={{ fontFamily: "var(--font-accent)", fontStyle: "italic", fontSize: 19, lineHeight: 1.35, color: "var(--ink-900)", margin: 0 }}>{f.note}</p>
          <p style={{ fontSize: 15, lineHeight: 1.55, color: "var(--ink-700)", margin: 0 }}>{f.detail}</p>

          {f.verdict === "unsafe" && (
            <WWCard variant="urgent" style={{ padding: 16 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <WWIcon name="phone" size={18} color="var(--coral-600)" strokeWidth={2} style={{ marginTop: 2 }} />
                <div>
                  <p style={{ fontWeight: 600, fontSize: 14, color: "var(--coral-700)", margin: "0 0 3px" }}>If {dog.name} has eaten this</p>
                  <p style={{ fontSize: 13.5, color: "var(--coral-700)", margin: 0, lineHeight: 1.5 }}>Call your vet or the Animal Poisons Helpline on <strong>1300 869 738</strong> straight away. Don't wait for symptoms.</p>
                </div>
              </div>
            </WWCard>
          )}

          <div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 600, margin: "0 0 10px", color: "var(--ink-900)" }}>Safe alternatives</h3>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {f.alts.map((a) => {
                const alt = D.WW_FOODS.find((x) => x.name === a);
                return <button key={a} onClick={() => alt && setOpen(alt)} style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "8px 13px", borderRadius: 999, border: "1px solid var(--sage-100)", background: "var(--sage-50)", color: "var(--sage-700)", fontWeight: 600, fontSize: 13.5, cursor: alt ? "pointer" : "default" }}><WWIcon name="circle-check" size={15} />{a}</button>;
              })}
            </div>
          </div>

          <WWSourceLine source={f.trust === "vet" ? "RSPCA Australia & vet review" : "Welcome Wag community"} date="May 2026" location="Australia" />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
            <WWTrustChip type={f.trust} />
            <FlagControl flagged={flagged} onFlag={() => setFlagged(true)} />
          </div>
          <Disclaimer />
        </div>
      </WWScreen>
    );
  }

  return (
    <WWScreen tabBar={tabBar}>
      <WWHeader onBack={onBack} subtitle="Safe & unsafe" title="Food guide" />
      <div style={{ padding: "0 20px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
        <WWInput value={q} onChange={setQ} placeholder="Search a food — e.g. grapes, pumpkin" prefixIcon="search" />
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 2, margin: "-2px -20px 0", padding: "0 20px" }}>
          {cats.map((c) => (
            <button key={c} onClick={() => setFilter(c)} style={{ whiteSpace: "nowrap", padding: "7px 14px", borderRadius: 999, fontSize: 13.5, fontWeight: 600, cursor: "pointer", border: filter === c ? "1.5px solid var(--brand)" : "1px solid var(--cream-300)", background: filter === c ? "var(--brand-tint)" : "var(--paper)", color: filter === c ? "var(--brand-press)" : "var(--ink-700)" }}>{c}</button>
          ))}
        </div>

        {noMatch ? (
          <WWCard variant="honey" style={{ padding: 18 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <WWIcon name="search-x" size={20} color="var(--honey-600)" style={{ marginTop: 2 }} />
              <div>
                <p style={{ fontWeight: 600, fontSize: 15, color: "var(--ink-900)", margin: "0 0 4px" }}>We don't have a trusted answer for "{q}"</p>
                <p style={{ fontSize: 13.5, color: "var(--ink-700)", margin: "0 0 12px", lineHeight: 1.5 }}>Rather than guess, we'd rather say so. If you're worried {dog.name} has eaten something, check with a vet.</p>
                <WWButton variant="dangerSoft" size="sm" icon="phone">Call Animal Poisons Helpline</WWButton>
              </div>
            </div>
          </WWCard>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {results.map((f) => (
              <WWCard key={f.name} variant="default" onClick={() => setOpen(f)} style={{ padding: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                      <p style={{ fontSize: 15.5, fontWeight: 600, color: "var(--ink-900)", margin: 0 }}>{f.name}</p>
                      <WWVerdict verdict={f.verdict} size="sm" />
                    </div>
                    <p style={{ fontSize: 12.5, color: "var(--ink-500)", margin: 0, lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical" }}>{f.note}</p>
                  </div>
                  <WWIcon name="chevron-right" size={18} color="var(--ink-300)" />
                </div>
              </WWCard>
            ))}
          </div>
        )}
        <Disclaimer>Food safety here is general and not tailored to allergies or health conditions. When unsure, ask your vet.</Disclaimer>
      </div>
    </WWScreen>
  );
}

/* ═══ BEHAVIOUR LIBRARY ════════════════════════════════════════ */
function BehaviourScreen({ dog, tabBar, onBack }) {
  const [q, setQ] = useStateT("");
  const [open, setOpen] = useStateT(null);
  const [flagged, setFlagged] = useStateT(false);
  const results = D.WW_BEHAVIOURS.filter((b) => (b.title + b.cat).toLowerCase().includes(q.toLowerCase()));

  if (open) {
    const b = open;
    const related = D.WW_BEHAVIOURS.filter((x) => x.id !== b.id && x.cat === b.cat).slice(0, 2);
    const moreRelated = related.length ? related : D.WW_BEHAVIOURS.filter((x) => x.id !== b.id).slice(0, 2);
    return (
      <WWScreen tabBar={tabBar}>
        <WWHeader onBack={() => { setOpen(null); setFlagged(false); }} subtitle={`Behaviour · ${b.cat}`} title={b.title} />
        <div style={{ padding: "0 20px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
          <WWCard variant="sage" style={{ padding: 16 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ width: 44, height: 44, borderRadius: 999, background: "var(--sage-100)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <WWIcon name="circle-check" size={22} color="var(--sage-700)" />
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: 15, color: "var(--ink-900)", margin: 0 }}>{b.normal} for {dog.name}</p>
                <p style={{ fontSize: 13, color: "var(--ink-700)", margin: "2px 0 0", lineHeight: 1.4 }}>{b.sub} Typical for a {dog.age} {dog.breed}.</p>
              </div>
            </div>
          </WWCard>

          <p style={{ fontFamily: "var(--font-accent)", fontStyle: "italic", fontSize: 19, lineHeight: 1.35, color: "var(--ink-900)", margin: 0 }}>
            It isn't bad behaviour — it's a young dog learning the rules of a brand-new world.
          </p>

          <div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, margin: "0 0 10px", color: "var(--ink-900)" }}>What to try</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {["Keep your response calm and boring — big reactions can accidentally reward it.", "Redirect to the right outlet: a chew toy, a settle mat, or a quick toilet trip.", "Reward the moment it stops, so the quiet choice becomes the easy one.", `Stay consistent for a week — most ${dog.breed}s settle fast once the pattern is clear.`].map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{ width: 24, height: 24, borderRadius: 999, background: "var(--brand-tint)", color: "var(--brand-press)", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</div>
                  <p style={{ fontSize: 14.5, color: "var(--ink-700)", margin: 0, lineHeight: 1.5, paddingTop: 1 }}>{s}</p>
                </div>
              ))}
            </div>
          </div>

          <WWCard variant="honey" style={{ padding: 16 }}>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <WWIcon name="stethoscope" size={18} color="var(--honey-600)" style={{ marginTop: 2 }} />
              <div>
                <p style={{ fontWeight: 600, fontSize: 14, color: "var(--ink-900)", margin: "0 0 3px" }}>When to call a vet or trainer</p>
                <p style={{ fontSize: 13.5, color: "var(--ink-700)", margin: 0, lineHeight: 1.5 }}>If it's getting worse after two weeks, comes with signs of real distress, or you ever feel out of your depth — a professional makes it easier.</p>
              </div>
            </div>
          </WWCard>

          <WWSourceLine source="RSPCA Australia behaviour guidance" date="April 2026" location="Australia" />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
            <WWTrustChip type={b.trust} />
            <FlagControl flagged={flagged} onFlag={() => setFlagged(true)} />
          </div>

          <div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 600, margin: "4px 0 10px", color: "var(--ink-900)" }}>Related behaviours</h3>
            <WWCard variant="default" style={{ padding: 0, overflow: "hidden" }}>
              {moreRelated.map((r, i) => <WWListRow key={r.id} icon={r.icon} iconTone={r.tone} title={r.title} sub={r.sub} onClick={() => { setOpen(r); setFlagged(false); }} last={i === moreRelated.length - 1} />)}
            </WWCard>
          </div>
          <Disclaimer />
        </div>
      </WWScreen>
    );
  }

  return (
    <WWScreen tabBar={tabBar}>
      <WWHeader onBack={onBack} subtitle="Is this normal?" title="Behaviour library" />
      <div style={{ padding: "0 20px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
        <WWInput value={q} onChange={setQ} placeholder="Search — e.g. crying at night, chewing" prefixIcon="search" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {results.map((b) => (
            <WWCard key={b.id} variant="default" onClick={() => setOpen(b)} style={{ padding: 16 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <WWIconBadge icon={b.icon} tone={b.tone} size={40} />
                <WWBadge tone={b.tone === "coral" ? "coral" : "sage"} style={{ fontSize: 11 }}>{b.normal}</WWBadge>
              </div>
              <h4 style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 600, margin: "0 0 3px", color: "var(--ink-900)" }}>{b.title}</h4>
              <p style={{ fontSize: 12.5, color: "var(--ink-500)", margin: 0, lineHeight: 1.4 }}>{b.sub}</p>
            </WWCard>
          ))}
        </div>
        <Disclaimer>Behaviour guidance is general. Serious aggression or severe distress needs a vet or qualified trainer.</Disclaimer>
      </div>
    </WWScreen>
  );
}

/* ═══ VET VISIT GUIDE ══════════════════════════════════════════ */
function VetScreen({ dog, tabBar, onBack, onToast }) {
  const [saved, setSaved] = useStateT(false);
  const [scheduled, setScheduled] = useStateT(false);
  return (
    <WWScreen tabBar={tabBar}>
      <WWHeader onBack={onBack} subtitle="First vet visit" title="Time to book a check-up" />
      <div style={{ padding: "0 20px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
        <WWCard variant="brand" style={{ padding: 20 }}>
          <div className="eyebrow" style={{ color: "var(--honey-100)", marginBottom: 6 }}>Recommended window</div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 21, fontWeight: 600, margin: "0 0 6px", lineHeight: 1.2 }}>Within the next 7 days</h2>
          <p style={{ fontSize: 14, color: "var(--terracotta-100)", margin: 0, lineHeight: 1.45 }}>A young {dog.breed} is due a health check and second vaccination. Booking now keeps {dog.name}'s schedule on track.</p>
        </WWCard>

        <div>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, margin: "0 0 10px", color: "var(--ink-900)" }}>What to expect</h3>
          <WWCard variant="default" style={{ padding: 0, overflow: "hidden" }}>
            <WWListRow icon="clipboard-list" iconTone="sky" title="Check-in & weigh-in" sub="A quick weight and history" chevron={false} />
            <WWListRow icon="stethoscope" iconTone="sage" title="Nose-to-tail exam" sub="Heart, eyes, ears, teeth, joints" chevron={false} />
            <WWListRow icon="syringe" iconTone="honey" title="Vaccination & worming" sub="Second C3, plus a parasite plan" chevron={false} last />
          </WWCard>
        </div>

        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "0 4px 10px" }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, margin: 0, color: "var(--ink-900)" }}>Questions to ask</h3>
            <button onClick={() => { setSaved(true); onToast("Questions saved to records"); }} style={{ border: 0, background: "transparent", color: "var(--brand-hover)", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "inline-flex", gap: 6, alignItems: "center" }}>
              <WWIcon name={saved ? "check" : "bookmark"} size={15} />{saved ? "Saved" : "Save list"}
            </button>
          </div>
          <WWCard variant="default" style={{ padding: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {D.WW_VET_QUESTIONS.map((qq, i) => (
                <div key={i} style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
                  <WWIcon name="message-circle-question" size={17} color="var(--brand)" style={{ marginTop: 2, flexShrink: 0 }} />
                  <p style={{ fontSize: 14, color: "var(--ink-700)", margin: 0, lineHeight: 1.45 }}>{qq}</p>
                </div>
              ))}
            </div>
          </WWCard>
        </div>

        <div>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, margin: "0 0 10px", color: "var(--ink-900)" }}>Vets near {dog.suburb.split(",")[0]}</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {D.WW_VETS.map((v, i) => (
              <WWCard key={i} variant={v.emergency ? "outline" : "default"} style={{ padding: 16 }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <WWIconBadge icon={v.emergency ? "ambulance" : "map-pin"} tone={v.emergency ? "coral" : "sky"} size={40} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <p style={{ fontSize: 15, fontWeight: 600, color: "var(--ink-900)", margin: 0 }}>{v.name}</p>
                      {v.rating && <WWBadge tone="sage" icon="star">{v.rating}</WWBadge>}
                    </div>
                    <p style={{ fontSize: 13, color: "var(--ink-500)", margin: "3px 0 0" }}>{v.suburb} · {v.dist}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "8px 0 0", flexWrap: "wrap" }}>
                      <WWBadge tone={v.emergency ? "coral" : "sage"} dot>{v.hours}</WWBadge>
                      <span style={{ fontSize: 12.5, color: "var(--ink-500)" }}>{v.note}</span>
                    </div>
                    <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                      <WWButton variant={v.emergency ? "danger" : "primary"} size="sm" icon="phone">{v.phone}</WWButton>
                      <WWButton variant="ghost" size="sm" icon="globe">Website</WWButton>
                    </div>
                  </div>
                </div>
              </WWCard>
            ))}
          </div>
          <p style={{ fontSize: 12, color: "var(--ink-500)", margin: "10px 4px 0", lineHeight: 1.5 }}>
            Clinic list is information only — we don't book on your behalf. Distances from postcode {dog.postcode}.
          </p>
        </div>

        <WWButton variant={scheduled ? "secondary" : "primary"} size="lg" full icon={scheduled ? "check" : "calendar-check"} onClick={() => { setScheduled(true); onToast("Reminder added — day before your visit"); }}>
          {scheduled ? "Marked as booked" : "I've booked the visit"}
        </WWButton>
        <Disclaimer />
      </div>
    </WWScreen>
  );
}

/* ═══ ROUTINE BUILDER ══════════════════════════════════════════ */
function RoutineScreen({ dog, tabBar, onBack, onToast }) {
  const [start, setStart] = useStateT("6:30am");
  const [items, setItems] = useStateT(D.WW_ROUTINE);
  const [saved, setSaved] = useStateT(false);
  const toiletCount = items.filter((i) => i.label.toLowerCase().includes("toilet")).length;

  return (
    <WWScreen tabBar={tabBar}>
      <WWHeader onBack={onBack} subtitle={`${dog.name}'s day`} title="Daily routine" action={
        <button onClick={() => { setSaved(true); onToast("Routine saved"); }} style={{ width: 38, height: 38, borderRadius: "var(--radius-pill)", border: 0, background: saved ? "var(--sage-500)" : "var(--brand)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "var(--shadow-pop)", cursor: "pointer" }}>
          <WWIcon name={saved ? "check" : "save"} size={17} color="white" />
        </button>
      } />
      <div style={{ padding: "0 20px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
        <WWCard variant="sky" style={{ padding: 16 }}>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <WWIcon name="wand-sparkles" size={18} color="var(--sky-600)" style={{ marginTop: 2 }} />
            <p style={{ fontSize: 13, color: "var(--ink-700)", margin: 0, lineHeight: 1.5 }}>
              Pre-filled for an <strong>{dog.age} {dog.breed}</strong> — three meals, frequent toilet trips and plenty of rest. Tweak times to fit your day.
            </p>
          </div>
        </WWCard>

        {toiletCount >= 4 ? (
          <WWCard variant="sage" style={{ padding: 13 }}>
            <div style={{ display: "flex", gap: 9, alignItems: "center" }}>
              <WWIcon name="circle-check" size={17} color="var(--sage-700)" />
              <p style={{ fontSize: 13, color: "var(--ink-700)", margin: 0 }}>{toiletCount} toilet breaks — good for a puppy this age.</p>
            </div>
          </WWCard>
        ) : (
          <WWCard variant="honey" style={{ padding: 13 }}>
            <div style={{ display: "flex", gap: 9, alignItems: "center" }}>
              <WWIcon name="info" size={17} color="var(--honey-600)" />
              <p style={{ fontSize: 13, color: "var(--ink-700)", margin: 0 }}>Puppies need a toilet trip roughly every 2 hours — consider adding one.</p>
            </div>
          </WWCard>
        )}

        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: 27, top: 8, bottom: 8, width: 2, background: "var(--cream-200)" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {items.map((it, i) => (
              <div key={i} style={{ display: "flex", gap: 14, position: "relative" }}>
                <div style={{ width: 56, flexShrink: 0, textAlign: "right", paddingTop: 14 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-500)", fontVariantNumeric: "tabular-nums" }}>{it.time}</span>
                </div>
                <div style={{ position: "relative", flexShrink: 0, paddingTop: 12 }}>
                  <div style={{ width: 14, height: 14, borderRadius: 999, background: "var(--paper)", border: "3px solid var(--brand)", position: "relative", zIndex: 1, marginLeft: -7 }} />
                </div>
                <WWCard variant="default" style={{ padding: 12, flex: 1, marginLeft: 2 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <WWIconBadge icon={it.icon} tone={it.tone} size={34} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                        <p style={{ fontSize: 14.5, fontWeight: 600, color: "var(--ink-900)", margin: 0 }}>{it.label}</p>
                        {it.essential && <WWBadge tone="sage" style={{ fontSize: 10.5, padding: "3px 8px" }}>Essential</WWBadge>}
                      </div>
                      {it.note && <p style={{ fontSize: 12, color: "var(--ink-500)", margin: "2px 0 0", lineHeight: 1.4 }}>{it.note}</p>}
                    </div>
                  </div>
                </WWCard>
              </div>
            ))}
          </div>
        </div>

        <WWButton variant="ghost" size="md" full icon="plus" onClick={() => onToast("Add a custom activity")}>Add an activity</WWButton>
        <Disclaimer>Routine adapts to {dog.name}'s age — revisit it weekly as they settle and grow.</Disclaimer>
      </div>
    </WWScreen>
  );
}

/* ═══ URGENT SHEET ═════════════════════════════════════════════ */
function UrgentSheet({ dog, onClose }) {
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 100 }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(42,33,27,0.4)", animation: "ww-fade 220ms var(--ease-out)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, background: "var(--cream-50)", borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: "12px 20px 30px", boxShadow: "0 -8px 32px rgba(46,33,27,0.18)", animation: "ww-slide-up 280ms var(--ease-out)" }}>
        <div style={{ width: 36, height: 4, background: "var(--cream-300)", borderRadius: 999, margin: "0 auto 18px" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{ width: 36, height: 36, borderRadius: 999, background: "var(--coral-500)", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <WWIcon name="alert-triangle" size={18} color="white" strokeWidth={2} />
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, margin: 0, color: "var(--ink-900)" }}>Get urgent help</h2>
        </div>
        <p style={{ fontSize: 14, color: "var(--ink-700)", margin: "0 0 16px", lineHeight: 1.5 }}>
          The Welcome Wag doesn't diagnose. For poisoning, breathing trouble, or heavy bleeding, call a vet now — even if you're unsure.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { icon: "phone", bg: "var(--coral-500)", fg: "white", t: "Call my vet", s: `${dog.vet === "—" ? "Add a vet in your profile" : dog.vet} · (02) 9519 4111` },
            { icon: "droplet", bg: "var(--paper)", fg: "var(--coral-700)", border: "1.5px solid var(--coral-300)", t: "Animal Poisons Helpline", s: "Suspected poisoning · 1300 869 738 · 24/7" },
            { icon: "ambulance", bg: "var(--paper)", fg: "var(--ink-900)", border: "1px solid var(--cream-300)", t: "Nearest emergency vet", s: "Sydney Animal Emergency · ~9 min by car" },
          ].map((b, i) => (
            <button key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "15px 18px", background: b.bg, color: b.fg, border: b.border || 0, borderRadius: 20, cursor: "pointer", textAlign: "left" }}>
              <WWIcon name={b.icon} size={22} color={b.fg} strokeWidth={2} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 16 }}>{b.t}</div>
                <div style={{ fontSize: 13, opacity: 0.9, color: b.fg }}>{b.s}</div>
              </div>
            </button>
          ))}
        </div>
        <button onClick={onClose} style={{ marginTop: 16, width: "100%", padding: 14, background: "transparent", border: 0, color: "var(--ink-700)", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>Close</button>
      </div>
    </div>
  );
}

Object.assign(window, { ShoppingScreen, FoodScreen, BehaviourScreen, VetScreen, RoutineScreen, UrgentSheet });
