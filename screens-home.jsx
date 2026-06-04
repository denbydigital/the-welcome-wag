// Welcome Wag — home screens: Today (settling-in timeline), Records, Profile.
const { useState: useStateH } = React;
const { WW_TIMELINE } = window.WW_DATA;

/* ─── TODAY / settling-in timeline ──────────────────────────── */
function TodayScreen({ dog, tabBar, onUrgent, onOpen, onProfile, completed, onComplete }) {
  return (
    <WWScreen tabBar={tabBar}>
      <div style={{ padding: "8px 20px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="eyebrow">{dog.stage === "Pre-arrival" ? "Counting down" : `Tuesday · ${dog.dayLabel}`}</div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 29, fontWeight: 600, letterSpacing: "-0.02em", margin: "2px 0 0", lineHeight: 1.08 }}>
              {dog.stage === "Pre-arrival" ? `Nearly there, ${dog.name}.` : `Morning — how's ${dog.name}?`}
            </h1>
          </div>
          <button onClick={onProfile} style={{ border: 0, background: "transparent", padding: 0, cursor: "pointer" }}>
            <WWAvatar name={dog.name} initial={dog.initial} tone={dog.tone} size={46} />
          </button>
        </div>

        {/* Hero — what matters now */}
        <WWCard variant="brand" style={{ marginBottom: 14 }}>
          <div className="eyebrow" style={{ color: "var(--honey-100)", marginBottom: 8 }}>What matters now</div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, lineHeight: 1.18, margin: "0 0 6px", letterSpacing: "-0.01em" }}>
            {dog.stage === "Pre-arrival" ? "Get the house ready before pickup" : "Second vaccination this Friday"}
          </h2>
          <p style={{ fontSize: 14, lineHeight: 1.45, color: "var(--terracotta-100)", margin: "0 0 16px" }}>
            {dog.stage === "Pre-arrival"
              ? `4 days to go. Work through the shopping checklist so day one with ${dog.name} is calm, not chaotic.`
              : `A week after, you can start short on-lead walks. Tap to prep — what to bring, what to ask your vet.`}
          </p>
          <WWButton variant="secondary" size="sm" onClick={() => onOpen(dog.stage === "Pre-arrival" ? "shopping" : "vet")} iconRight="arrow-right" style={{ background: "var(--paper)", color: "var(--brand-press)" }}>
            {dog.stage === "Pre-arrival" ? "Open shopping checklist" : "Prep for the visit"}
          </WWButton>
        </WWCard>

        {/* This week */}
        <WWSection title="This week" action="See all" style={{ margin: "20px 4px 10px" }} />
        <WWCard variant="default" style={{ padding: 0, marginBottom: 14, overflow: "hidden" }}>
          {WW_TIMELINE.today.map((t, i) => {
            const done = completed.includes("tl-" + i);
            return (
              <WWListRow key={i} icon={done ? "check" : t.icon} iconTone={done ? "sage" : t.tone}
                title={t.title} sub={done ? "Done" : t.sub} chevron={false}
                metaEl={
                  <button onClick={() => onComplete("tl-" + i)} style={{
                    width: 26, height: 26, borderRadius: 999, cursor: "pointer", flexShrink: 0,
                    border: done ? "0" : "1.6px solid var(--cream-300)", background: done ? "var(--sage-500)" : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>{done && <WWIcon name="check" size={15} color="white" strokeWidth={2.4} />}</button>
                }
                meta={done ? undefined : t.meta} last={i === WW_TIMELINE.today.length - 1} />
            );
          })}
        </WWCard>

        {/* Tools grid */}
        <WWSection title={`For ${dog.name}, right now`} style={{ margin: "20px 4px 10px" }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
          {[
            { id: "shopping", icon: "shopping-basket", tone: "brand", t: "Shopping", s: "Day-one kit" },
            { id: "food", icon: "apple", tone: "sage", t: "Food guide", s: "Safe to share?" },
            { id: "behaviour", icon: "dog", tone: "honey", t: "Behaviour", s: "Is this normal?" },
            { id: "routine", icon: "clock", tone: "sky", t: "Routine", s: "Daily rhythm" },
          ].map((tool) => (
            <WWCard key={tool.id} variant="default" onClick={() => onOpen(tool.id)} style={{ padding: 16 }}>
              <WWIconBadge icon={tool.icon} tone={tool.tone} size={40} />
              <h4 style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 600, margin: "12px 0 2px", color: "var(--ink-900)" }}>{tool.t}</h4>
              <p style={{ fontSize: 12.5, color: "var(--ink-500)", margin: 0 }}>{tool.s}</p>
            </WWCard>
          ))}
        </div>

        {/* Featured guidance */}
        <WWCard variant="default" onClick={() => onOpen("behaviour")} style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <WWStageMarker stage={dog.stage} />
            <WWBadge tone="honey">Updated today</WWBadge>
          </div>
          <h4 style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 600, margin: "0 0 4px", color: "var(--ink-900)" }}>The first night, hour by hour</h4>
          <p style={{ fontSize: 13.5, color: "var(--ink-700)", margin: 0, lineHeight: 1.5 }}>
            Settle a {dog.breed} from 7pm onwards — what to expect, when to step in.
          </p>
        </WWCard>

        {/* Urgent rail */}
        <WWCard variant="urgent" onClick={onUrgent} style={{ padding: 14, cursor: "pointer" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 999, background: "var(--coral-500)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <WWIcon name="alert-triangle" size={18} color="white" strokeWidth={2} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 600, color: "var(--coral-700)", margin: 0 }}>Urgent help</p>
              <p style={{ fontSize: 12.5, color: "var(--coral-700)", margin: "2px 0 0" }}>Poisoning, breathing, bleeding — reach a vet now.</p>
            </div>
            <WWIcon name="chevron-right" size={18} color="var(--coral-600)" />
          </div>
        </WWCard>
      </div>
    </WWScreen>
  );
}

/* ─── RECORDS ───────────────────────────────────────────────── */
function RecordsScreen({ dog, tabBar }) {
  return (
    <WWScreen tabBar={tabBar}>
      <WWHeader title={`${dog.name}'s records`} action={
        <button style={{ width: 38, height: 38, borderRadius: "var(--radius-pill)", border: 0, background: "var(--brand)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "var(--shadow-pop)", cursor: "pointer" }}>
          <WWIcon name="plus" size={18} color="white" strokeWidth={2} />
        </button>
      } />
      <div style={{ padding: "0 20px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
        <WWCard variant="default" style={{ padding: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <WWAvatar name={dog.name} initial={dog.initial} tone={dog.tone} size={56} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, margin: 0, color: "var(--ink-900)" }}>{dog.name}</p>
              <p style={{ fontSize: 13, color: "var(--ink-500)", margin: "2px 0 0" }}>{dog.breed} · {dog.age} · {dog.weight}</p>
            </div>
            <WWBadge tone="sage" dot>Healthy</WWBadge>
          </div>
        </WWCard>

        <div>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, margin: "0 0 10px 4px" }}>Vaccinations</h3>
          <WWCard variant="default" style={{ padding: 0, overflow: "hidden" }}>
            <WWListRow icon="syringe" iconTone="sage" title="C3 — first vaccination" sub="Given 23 May · breeder's vet" metaEl={<WWIcon name="circle-check" size={18} color="var(--sage-600)" />} chevron={false} />
            <WWListRow icon="syringe" iconTone="honey" title="C3 — second vaccination" sub="Booked Fri 6 Jun" meta="3 days" />
            <WWListRow icon="bug" iconTone="neutral" title="Flea, tick & worming" sub="Tick season — ask your vet" meta="Due" last />
          </WWCard>
        </div>

        <div>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, margin: "0 0 10px 4px" }}>Documents</h3>
          <WWCard variant="default" style={{ padding: 0, overflow: "hidden" }}>
            <WWListRow icon="file-text" iconTone="brand" title="Breeder paperwork" sub="3 pages · 12 May" />
            <WWListRow icon="scan-line" iconTone="brand" title="Microchip certificate" sub="991 0031 2004 8813" />
            <WWListRow icon="shield-check" iconTone="brand" title="Pet insurance" sub="Bow Wow Meow · renews May 2027" last />
          </WWCard>
        </div>
      </div>
    </WWScreen>
  );
}

/* ─── PROFILE ───────────────────────────────────────────────── */
function ProfileScreen({ dog, tabBar, onSwitch }) {
  return (
    <WWScreen tabBar={tabBar}>
      <div style={{ padding: "0 20px 20px" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "8px 0 20px" }}>
          <WWAvatar name={dog.name} initial={dog.initial} tone={dog.tone} size={92} />
          <div style={{ textAlign: "center" }}>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 27, fontWeight: 600, margin: 0, letterSpacing: "-0.02em" }}>{dog.name}</h1>
            <p style={{ fontSize: 14, color: "var(--ink-500)", margin: "4px 0 0" }}>{dog.breed} · {dog.arrival}</p>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
            <WWBadge tone="brand">{dog.dayLabel}</WWBadge>
            <WWBadge tone="neutral">{dog.age}</WWBadge>
            <WWBadge tone="neutral">{dog.weight}</WWBadge>
            <WWBadge tone="neutral">{dog.suburb}</WWBadge>
          </div>
        </div>

        {/* profile completeness */}
        <WWCard variant="honey" style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ position: "relative", width: 44, height: 44, flexShrink: 0 }}>
              <svg width="44" height="44" viewBox="0 0 44 44"><circle cx="22" cy="22" r="19" fill="none" stroke="var(--honey-100)" strokeWidth="5" /><circle cx="22" cy="22" r="19" fill="none" stroke="var(--honey-500)" strokeWidth="5" strokelinecap="round" strokeDasharray="119" strokeDashoffset="24" transform="rotate(-90 22 22)" /></svg>
              <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "var(--honey-600)" }}>80%</span>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 600, fontSize: 14.5, color: "var(--ink-900)", margin: 0 }}>Add {dog.name}'s weight</p>
              <p style={{ fontSize: 13, color: "var(--ink-700)", margin: "2px 0 0" }}>One more detail sharpens feeding & dosage guidance.</p>
            </div>
            <WWIcon name="chevron-right" size={18} color="var(--honey-600)" />
          </div>
        </WWCard>

        <WWCard variant="default" style={{ padding: 0, overflow: "hidden", marginBottom: 14 }}>
          <WWListRow icon="user-round" iconTone="brand" title="Edit profile" sub="Name, breed, age, weight" />
          <WWListRow icon="map-pin" iconTone="brand" title="Location" sub={`${dog.suburb} · ${dog.postcode}`} />
          <WWListRow icon="stethoscope" iconTone="brand" title="My vet" sub={dog.vet} last />
        </WWCard>

        <WWCard variant="default" style={{ padding: 0, overflow: "hidden", marginBottom: 14 }}>
          <WWListRow icon="bell" iconTone="neutral" title="Reminders" sub="Daily nudge at 8am" />
          <WWListRow icon="flag" iconTone="neutral" title="Advice I've flagged" sub="Help us keep guidance safe" />
          <WWListRow icon="languages" iconTone="neutral" title="Units & language" sub="kg · 24h · Australian English" last />
        </WWCard>

        <WWCard variant="flat" style={{ padding: 0, overflow: "hidden", marginBottom: 14 }}>
          <WWListRow icon="repeat" iconTone="neutral" title="Switch dog" sub="Try a different sample profile" onClick={onSwitch} />
          <WWListRow icon="info" iconTone="neutral" title="About Welcome Wag" sub="Guidance, not diagnosis." />
          <WWListRow icon="log-out" iconTone="neutral" title="Sign out" sub="hello@welcomewag.com.au" last />
        </WWCard>
      </div>
    </WWScreen>
  );
}

Object.assign(window, { TodayScreen, RecordsScreen, ProfileScreen });
