import React, { useState, useRef, useEffect } from 'react';
import './styles/App.css';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [vitalsView, setVitalsView] = useState('summary');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsDropdownOpen(false);
    alert('Logging out...');
  };

  const handlePreferences = () => {
    setIsDropdownOpen(false);
    setActiveTab('preferences');
  };

  const handleBilling = () => {
    setIsDropdownOpen(false);
    setActiveTab('billing');
  };

  const handleViewDetail = () => {
    setVitalsView('detail');
  };

  const handleBackToSummary = () => {
    setVitalsView('summary');
  };

  return (
    <div className="app" role="main">
      <h2 className="sr-only" style={{position:'absolute',width:'1px',height:'1px',overflow:'hidden'}}>
        SignetSure pharmaceutical app prototype with biometric ID, drug safety, vitals monitoring, caregiver alerts, and chatbot
      </h2>

      <nav className="nav">
        <div className="nav-brand">
          <div className="logo">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          SignetSure
        </div>
        <div className="nav-right">
          <button className="btn-nav" onClick={() => setActiveTab('alerts')}>
            <span style={{fontSize:'14px'}}>🔔</span>
            <span className="badge-dot"></span>
          </button>
          <button className="btn-nav primary" onClick={() => setActiveTab('biometric')}>
            Verify ID
          </button>
          <div className="user-dropdown-wrapper" ref={dropdownRef}>
            <button 
              className={`user-avatar-btn ${isDropdownOpen ? 'active' : ''}`}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              aria-label="User menu"
            >
              <span className="user-avatar-initials">JM</span>
              <span className="dropdown-arrow">▾</span>
            </button>
            {isDropdownOpen && (
              <div className="user-dropdown">
                <div className="dropdown-header">
                  <div className="dropdown-avatar">JM</div>
                  <div className="dropdown-user-info">
                    <div className="dropdown-user-name">James Mitchell</div>
                    <div className="dropdown-user-email">james@signetsure.com</div>
                  </div>
                </div>
                <button className="dropdown-item" onClick={handlePreferences}>
                  <span className="dropdown-icon">⚙️</span> User Preferences
                </button>
                <button className="dropdown-item" onClick={handleBilling}>
                  <span className="dropdown-icon">💳</span> Billing & Payment
                </button>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item logout" onClick={handleLogout}>
                  <span className="dropdown-icon">🚪</span> Logout
                </button>
                <div className="dropdown-footer">
                  <div className="dropdown-status">
                    <span className="status-dot"></span> Online · v2.1.0
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="tabs" role="tablist">
        {['home', 'biometric', 'drugs', 'vitals', 'schedule', 'caregiver', 'chat', 'alerts'].map((tab) => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => {
              setActiveTab(tab);
              if (tab === 'vitals') setVitalsView('summary');
            }}
            data-tab={tab}
            role="tab"
          >
            {tab === 'home' && '🏠 Home'}
            {tab === 'biometric' && '🔐 Biometric'}
            {tab === 'drugs' && '💊 Drug Safety'}
            {tab === 'vitals' && '❤️ Vitals'}
            {tab === 'schedule' && '📅 Schedule'}
            {tab === 'caregiver' && '👥 Caregiver'}
            {tab === 'chat' && '💬 Chat'}
            {tab === 'alerts' && '🔔 Alerts'}
          </button>
        ))}
      </div>

      <div className={`screen ${activeTab === 'home' ? 'active' : ''}`} id="screen-home">
        <HomeScreen />
      </div>
      <div className={`screen ${activeTab === 'biometric' ? 'active' : ''}`} id="screen-biometric">
        <BiometricScreen />
      </div>
      <div className={`screen ${activeTab === 'drugs' ? 'active' : ''}`} id="screen-drugs">
        <DrugsScreen />
      </div>
      <div className={`screen ${activeTab === 'vitals' ? 'active' : ''}`} id="screen-vitals">
        {vitalsView === 'summary' ? (
          <VitalsScreen onViewDetail={handleViewDetail} />
        ) : (
          <VitalsDetailScreen onBack={handleBackToSummary} />
        )}
      </div>
      <div className={`screen ${activeTab === 'schedule' ? 'active' : ''}`} id="screen-schedule">
        <ScheduleScreen />
      </div>
      <div className={`screen ${activeTab === 'caregiver' ? 'active' : ''}`} id="screen-caregiver">
        <CaregiverScreen />
      </div>
      <div className={`screen ${activeTab === 'chat' ? 'active' : ''}`} id="screen-chat">
        <ChatScreen />
      </div>
      <div className={`screen ${activeTab === 'alerts' ? 'active' : ''}`} id="screen-alerts">
        <AlertsScreen />
      </div>
      <div className={`screen ${activeTab === 'preferences' ? 'active' : ''}`} id="screen-preferences">
        <PreferencesScreen />
      </div>
      <div className={`screen ${activeTab === 'billing' ? 'active' : ''}`} id="screen-billing">
        <BillingScreen />
      </div>
    </div>
  );
}

// ==================== HOME SCREEN ====================
function HomeScreen() {
  const [bannerVisible, setBannerVisible] = useState(true);

  return (
    <>
      {bannerVisible && (
        <div className="push-banner" id="push-home">
          <span style={{fontSize:'16px'}}>📍</span>
          <div className="push-banner-text">
            <strong>CVS Pharmacy detected nearby</strong>
            Interaction alerts active for your current medications
          </div>
          <button className="push-banner-close" onClick={() => setBannerVisible(false)}>×</button>
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Blood Pressure</div>
          <div className="stat-value ok">118<span className="stat-unit">/76</span></div>
          <div className="stat-trend" style={{color:'var(--teal)'}}>↓ Normal range</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Heart Rate</div>
          <div className="stat-value ok">68<span className="stat-unit"> bpm</span></div>
          <div className="stat-trend" style={{color:'var(--teal)'}}>⚡ Resting normal</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Medications Today</div>
          <div className="stat-value warn">3<span className="stat-unit">/5</span></div>
          <div className="progress-bar"><div className="progress-fill warn" style={{width:'60%'}}></div></div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Interactions Flagged</div>
          <div className="stat-value danger">2</div>
          <div className="stat-trend" style={{color:'var(--red)'}}>Requires attention</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title"><span style={{color:'var(--teal)'}}>⏰</span> Next Dose</span>
          <span style={{fontSize:'11px',color:'var(--color-text-secondary)'}}>2:30 PM</span>
        </div>
        <div className="sched-row" style={{border:'none',padding:'4px 0'}}>
          <div className="sched-pill-icon pm"><span>💊</span></div>
          <div style={{flex:1}}>
            <div className="sched-name">Lisinopril 10mg</div>
            <div className="sched-dose">Take with water · 1 tablet</div>
          </div>
          <button className="btn sm primary" onClick={() => window.location.hash = 'schedule'}>View Schedule</button>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title"><span style={{color:'var(--teal)'}}>🛡️</span> System Integrations</span>
        </div>
        <div className="integration-row">
          <div className="int-icon blue"><span>🗄️</span></div>
          <div className="int-info">
            <div className="int-name">Chesapeake CRISP</div>
            <div className="int-status connected">✓ Connected</div>
          </div>
          <button className="int-btn active">View Data</button>
        </div>
        <div className="integration-row">
          <div className="int-icon green"><span>📋</span></div>
          <div className="int-info">
            <div className="int-name">PDMP</div>
            <div className="int-status connected">✓ Synced</div>
          </div>
          <button className="int-btn active">View Rx</button>
        </div>
      </div>

      <div className="card" style={{background:'var(--teal-light)',borderColor:'#9FE1CB'}}>
        <div className="card-header">
          <span className="card-title" style={{color:'var(--teal)'}}>🤖 AI Assistant</span>
        </div>
        <p style={{fontSize:'13px',color:'var(--teal)',marginBottom:'10px'}}>How are you feeling today, James?</p>
        <div style={{display:'flex',gap:'6px',flexWrap:'wrap'}}>
          <button className="feel-btn">Great</button>
          <button className="feel-btn">Side effects</button>
          <button className="feel-btn">Not great</button>
        </div>
      </div>
    </>
  );
}

// ==================== BIOMETRIC SCREEN ====================
function BiometricScreen() {
  const [scanStatus, setScanStatus] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [ageSelected, setAgeSelected] = useState('');
  const [geoEnabled, setGeoEnabled] = useState(true);

  const startScan = () => {
    if (isScanning) return;
    setIsScanning(true);
    const steps = ['Initializing camera...', 'Detecting face...', 'Verifying identity...', 'Identity confirmed'];
    let i = 0;
    setScanStatus(steps[0]);
    const interval = setInterval(() => {
      i++;
      if (i < steps.length) {
        setScanStatus(steps[i]);
      } else {
        clearInterval(interval);
        setIsScanning(false);
        setScanStatus('✅ Verified — James Mitchell · Access granted');
      }
    }, 900);
  };

  return (
    <>
      <div className="bio-gate">
        <div className="face-ring">
          <span>👤</span>
          <div className="scan-line"></div>
        </div>
        <p style={{fontWeight:'600',fontSize:'15px',marginBottom:'6px'}}>Biometric Verification</p>
        <p className="bio-status">Facial recognition for secure pharmacy access</p>
        <div className="consent-box">
          <strong style={{color:'var(--blue)',display:'block',marginBottom:'4px'}}>🔒 Consent Required</strong>
          By proceeding, you consent to biometric data collection for identity verification purposes per HIPAA guidelines. Data is encrypted and not shared with third parties.
        </div>
        <div className="section-label" style={{marginTop:'0'}}>Age Verification</div>
        <p style={{fontSize:'12px',color:'var(--color-text-secondary)',marginBottom:'8px'}}>I confirm I am:</p>
        <div className="age-verify">
          <button className={`age-btn ${ageSelected === '13-17' ? 'selected' : ''}`} onClick={() => setAgeSelected('13-17')}>13–17 years</button>
          <button className={`age-btn ${ageSelected === '18+' ? 'selected' : ''}`} onClick={() => setAgeSelected('18+')}>18+ years</button>
        </div>
        <button className="btn primary" style={{width:'100%',justifyContent:'center',marginTop:'8px',borderRadius:'10px'}} onClick={startScan}>
          Begin Face Scan
        </button>
        <p style={{fontSize:'12px',color:'var(--teal)',marginTop:'10px',minHeight:'18px'}}>{scanStatus}</p>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title"><span style={{color:'var(--amber)'}}>📍</span> Geographic Alerts</span>
          <span style={{fontSize:'11px',background:'var(--green-light)',color:'var(--green)',padding:'2px 8px',borderRadius:'12px',fontWeight:'500'}}>GPS Active</span>
        </div>
        <div className="geo-alert">
          <span>⚠️</span>
          <div className="geo-alert-text">
            <strong>Walgreens #4821 — 0.3mi</strong>
            <span>3 of your prescriptions filled here. Drug interaction alerts will trigger automatically.</span>
          </div>
        </div>
        <div className="store-map">
          <div className="map-dot"></div>
          <div className="map-label">GPS · Public coordinates</div>
        </div>
        <div style={{marginTop:'10px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <span style={{fontSize:'12px',color:'var(--color-text-secondary)'}}>Push notifications</span>
          <button className={`notif-toggle ${geoEnabled ? '' : 'off'}`} onClick={() => setGeoEnabled(!geoEnabled)}></button>
        </div>
      </div>
    </>
  );
}

// ==================== DRUGS SCREEN ====================
function DrugsScreen() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSupps, setSelectedSupps] = useState(['Vitamin D', 'Zinc']);
  const [showPhotoNotice, setShowPhotoNotice] = useState(false);

  const supplements = ['Fish Oil', 'Vitamin D', "St. John's Wort", 'Melatonin', 'Magnesium', 'Zinc'];

  const toggleSupp = (supp) => {
    setSelectedSupps(prev => 
      prev.includes(supp) ? prev.filter(s => s !== supp) : [...prev, supp]
    );
  };

  const drugResults = [
    { name: 'Warfarin (Coumadin)', dose: 'Blood thinner · 5mg daily', tags: ['Aspirin: HIGH RISK', 'Ibuprofen: HIGH RISK', 'Vitamin K: Moderate', 'Leafy greens: Moderate', 'Acetaminophen: Low'] },
    { name: 'Lisinopril (Zestril)', dose: 'ACE inhibitor · 10mg daily', tags: ['Potassium: Moderate', 'NSAIDs: Moderate', 'Bananas: Low'] },
    { name: 'Metformin (Glucophage)', dose: 'Diabetes · 500mg twice daily', tags: ['Alcohol: Moderate', 'Caffeine: Low'] }
  ];

  const filteredDrugs = drugResults.filter(drug => 
    drug.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="card">
        <div className="card-title" style={{marginBottom:'10px'}}>
          <span style={{color:'var(--red)'}}>⚠️</span> Check Drug Safety
        </div>
        <p style={{fontSize:'12px',color:'var(--color-text-secondary)',marginBottom:'10px'}}>
          Search adverse events, side effects, drug-food interactions
        </p>
        <div className="search-wrap">
          <input 
            type="text" 
            placeholder="Enter medication name (e.g., Aspirin, Lisinopril)..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>
        <div className="photo-upload" onClick={() => {
          setShowPhotoNotice(true);
          setTimeout(() => setShowPhotoNotice(false), 2500);
        }}>
          <span style={{fontSize:'24px',display:'block',marginBottom:'6px'}}>📷</span>
          Photo identification — scan medication label or pill
        </div>
        {showPhotoNotice && (
          <div style={{background:'var(--green-light)',color:'var(--green)',padding:'8px 12px',borderRadius:'8px',fontSize:'12px',marginTop:'8px'}}>
            📷 Camera would open for medication label scan
          </div>
        )}
      </div>

      <div id="drug-results">
        <div className="high-risk-ping">
          <span>⚠️</span>
          <div>
            <div style={{fontSize:'12px',fontWeight:'600',color:'var(--red)'}}>High-risk interaction detected</div>
            <div style={{fontSize:'11px',color:'var(--color-text-secondary)'}}>Warfarin + Aspirin — increased bleeding risk</div>
          </div>
        </div>

        {filteredDrugs.map((drug, idx) => (
          <div className="drug-result" key={idx}>
            <div className="drug-name">{drug.name}</div>
            <div className="drug-meta">{drug.dose}</div>
            <div>
              {drug.tags.map((tag, i) => {
                let tagClass = 'tag-low';
                if (tag.includes('HIGH')) tagClass = 'tag-high';
                else if (tag.includes('Moderate')) tagClass = 'tag-mod';
                return (
                  <span className={`interaction-tag ${tagClass}`} key={i}>{tag}</span>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="section-label">Supplement Interactions</div>
      <div className="supp-grid">
        {supplements.map(supp => (
          <div 
            key={supp}
            className={`supp-item ${selectedSupps.includes(supp) ? 'selected' : ''}`} 
            onClick={() => toggleSupp(supp)}
          >
            <span>🌿</span> {supp}
          </div>
        ))}
      </div>
      {selectedSupps.length > 0 && (
        <div style={{marginTop:'10px',fontSize:'12px',color:'var(--amber)',background:'var(--amber-light)',padding:'8px 12px',borderRadius:'8px'}}>
          ⚠️ St. John's Wort may interact with Warfarin — reduces anticoagulant effect significantly.
        </div>
      )}
    </>
  );
}

// ==================== VITALS SCREEN ====================
function VitalsScreen({ onViewDetail }) {
  const [bpSys, setBpSys] = useState(118);
  const [bpDia, setBpDia] = useState(76);
  const [bannerVisible, setBannerVisible] = useState(true);
  const [logMsg, setLogMsg] = useState('');

  const logBP = () => {
    const sysInput = document.getElementById('sys-in');
    const diaInput = document.getElementById('dia-in');
    if (!sysInput || !diaInput) return;
    const s = sysInput.value;
    const d = diaInput.value;
    if (!s || !d) { setLogMsg('Please enter both values.'); return; }
    setBpSys(parseInt(s));
    setBpDia(parseInt(d));
    if (parseInt(s) > 139 || parseInt(d) > 89) {
      setLogMsg('⚠️ Elevated BP — caregiver alerted!');
    } else {
      setLogMsg('✅ Reading logged and synced to CRISP.');
    }
    sysInput.value = '';
    diaInput.value = '';
  };

  return (
    <>
      {bannerVisible && (
        <div className="push-banner">
          <span style={{fontSize:'16px'}}>❤️</span>
          <div className="push-banner-text">
            <strong>CRISP Integration Active</strong>
            Syncing with Chesapeake Regional Information System for EHR
          </div>
          <button className="push-banner-close" onClick={() => setBannerVisible(false)}>×</button>
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Systolic</div>
          <div className="stat-value ok" id="bp-sys">{bpSys}</div>
          <div className="stat-trend" style={{color:'var(--teal)'}}>mmHg · Normal</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Diastolic</div>
          <div className="stat-value ok" id="bp-dia">{bpDia}</div>
          <div className="stat-trend" style={{color:'var(--teal)'}}>mmHg · Normal</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Heart Rate</div>
          <div className="stat-value ok" id="hr-val">68</div>
          <div className="stat-trend" style={{color:'var(--teal)'}}>bpm · Resting</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">O₂ Saturation</div>
          <div className="stat-value ok">98<span className="stat-unit">%</span></div>
          <div className="stat-trend" style={{color:'var(--teal)'}}>SpO₂ · Normal</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title"><span style={{color:'var(--teal)'}}>📈</span> 7-Day BP Trend</span>
          <button className="btn sm primary" onClick={onViewDetail} style={{cursor:'pointer'}}>
            View Detail →
          </button>
        </div>
        <div className="chart-bar-row" id="bp-chart">
          {[55, 62, 78, 75, 60, 56, 55].map((height, i) => (
            <div key={i} className={`chart-bar ${i === 2 || i === 3 ? 'warn' : ''}`} style={{height:`${height}%`}}></div>
          ))}
        </div>
        <div style={{display:'flex',justifyContent:'space-between',fontSize:'10px',color:'var(--color-text-secondary)',marginTop:'4px'}}>
          <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Today</span>
        </div>
        <div style={{marginTop:'8px',paddingTop:'8px',borderTop:'0.5px solid var(--color-border-tertiary)',display:'flex',gap:'16px',fontSize:'10px',color:'var(--color-text-secondary)'}}>
          <span>✅ Normal</span>
          <span style={{color:'var(--amber)'}}>⚠️ Monitor</span>
          <span style={{color:'var(--red)'}}>🚨 Alert</span>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title"><span style={{color:'var(--blue)'}}>🗄️</span> CRISP & PDMP Sync</span>
        </div>
        <div className="integration-row">
          <div className="int-icon blue"><span>🏥</span></div>
          <div className="int-info">
            <div className="int-name">Chesapeake Regional Info System</div>
            <div className="int-status connected">Last sync: 2 min ago</div>
          </div>
          <button className="int-btn active">🔄 Sync</button>
        </div>
        <div className="integration-row">
          <div className="int-icon green"><span>📄</span></div>
          <div className="int-info">
            <div className="int-name">Prescription Drug Monitoring</div>
            <div className="int-status connected">3 active prescriptions</div>
          </div>
          <button className="int-btn active">View All</button>
        </div>
        <div style={{paddingTop:'10px'}}>
          <div style={{fontSize:'12px',color:'var(--color-text-secondary)',marginBottom:'6px'}}>Manual entry</div>
          <div style={{display:'flex',gap:'6px'}}>
            <input type="number" placeholder="Systolic" id="sys-in" style={{width:'50%',padding:'7px 10px',border:'0.5px solid var(--color-border-secondary)',borderRadius:'8px',fontFamily:'var(--font)',fontSize:'12px',background:'var(--color-background-primary)',color:'var(--color-text-primary)'}} />
            <input type="number" placeholder="Diastolic" id="dia-in" style={{width:'50%',padding:'7px 10px',border:'0.5px solid var(--color-border-secondary)',borderRadius:'8px',fontFamily:'var(--font)',fontSize:'12px',background:'var(--color-background-primary)',color:'var(--color-text-primary)'}} />
          </div>
          <button className="btn primary" style={{marginTop:'8px',width:'100%',justifyContent:'center',borderRadius:'10px'}} onClick={logBP}>
            Log Reading
          </button>
          <p style={{fontSize:'12px',color:'var(--teal)',marginTop:'6px',minHeight:'16px'}}>{logMsg}</p>
        </div>
      </div>
    </>
  );
}

// ==================== VITALS DETAIL SCREEN ====================
function VitalsDetailScreen({ onBack }) {
  const [selectedDate, setSelectedDate] = useState('Today');
  const [selectedVital, setSelectedVital] = useState('all');
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const hourlyData = {
    'Today': [
      { hour: '6:00 AM', bp: '115/74', oxygen: 98, temp: 98.2, hr: 68 },
      { hour: '7:00 AM', bp: '118/76', oxygen: 97, temp: 98.3, hr: 72 },
      { hour: '8:00 AM', bp: '120/78', oxygen: 98, temp: 98.4, hr: 70 },
      { hour: '9:00 AM', bp: '118/76', oxygen: 99, temp: 98.5, hr: 68 },
      { hour: '10:00 AM', bp: '116/74', oxygen: 98, temp: 98.3, hr: 66 },
      { hour: '11:00 AM', bp: '115/73', oxygen: 98, temp: 98.2, hr: 65 },
      { hour: '12:00 PM', bp: '118/76', oxygen: 97, temp: 98.4, hr: 70 },
      { hour: '1:00 PM', bp: '120/78', oxygen: 98, temp: 98.6, hr: 72 },
      { hour: '2:00 PM', bp: '122/80', oxygen: 98, temp: 98.7, hr: 74 },
      { hour: '3:00 PM', bp: '125/82', oxygen: 97, temp: 98.8, hr: 76 },
      { hour: '4:00 PM', bp: '118/76', oxygen: 98, temp: 98.5, hr: 70 },
      { hour: '5:00 PM', bp: '116/74', oxygen: 99, temp: 98.3, hr: 68 },
    ],
    'Yesterday': [
      { hour: '6:00 AM', bp: '114/72', oxygen: 98, temp: 98.1, hr: 67 },
      { hour: '8:00 AM', bp: '119/77', oxygen: 98, temp: 98.3, hr: 71 },
      { hour: '12:00 PM', bp: '117/75', oxygen: 97, temp: 98.4, hr: 69 },
      { hour: '4:00 PM', bp: '120/78', oxygen: 98, temp: 98.5, hr: 72 },
      { hour: '8:00 PM', bp: '122/80', oxygen: 97, temp: 98.6, hr: 74 },
    ]
  };

  const dates = ['Today', 'Yesterday', 'Last 7 Days'];
  const data = hourlyData[selectedDate] || hourlyData['Today'];

  const getStatusColor = (type, value) => {
    if (type === 'bp') {
      const [sys, dia] = value.split('/').map(Number);
      if (sys > 140 || dia > 90) return '#E24B4A';
      if (sys > 130 || dia > 85) return '#EF9F27';
      return '#0F6E56';
    }
    if (type === 'oxygen') {
      if (value < 90) return '#E24B4A';
      if (value < 95) return '#EF9F27';
      return '#0F6E56';
    }
    if (type === 'temp') {
      if (value > 100.4) return '#E24B4A';
      if (value > 99.5) return '#EF9F27';
      return '#0F6E56';
    }
    return '#0F6E56';
  };

  const getChartData = () => {
    if (selectedVital === 'all' || selectedVital === 'bp') {
      return data.map(d => {
        const [sys] = d.bp.split('/').map(Number);
        return { label: d.hour, value: sys, unit: 'mmHg', full: d.bp };
      });
    }
    if (selectedVital === 'oxygen') {
      return data.map(d => ({ label: d.hour, value: d.oxygen, unit: '%', full: `${d.oxygen}%` }));
    }
    if (selectedVital === 'temp') {
      return data.map(d => ({ label: d.hour, value: d.temp, unit: '°F', full: `${d.temp}°F` }));
    }
    return data.map(d => ({ label: d.hour, value: d.hr, unit: 'bpm', full: `${d.hr} bpm` }));
  };

  const chartData = getChartData();
  const maxValue = Math.max(...chartData.map(d => d.value)) * 1.15;
  const minValue = Math.min(...chartData.map(d => d.value)) * 0.85;
  const range = maxValue - minValue || 1;

  const generatePath = () => {
    const width = chartData.length * 45 + 20;
    const height = 180;
    const padding = { top: 20, bottom: 20, left: 10, right: 10 };
    const chartHeight = height - padding.top - padding.bottom;
    const chartWidth = width - padding.left - padding.right;

    let path = '';
    chartData.forEach((d, i) => {
      const x = padding.left + (i / (chartData.length - 1)) * chartWidth;
      const y = padding.top + chartHeight - ((d.value - minValue) / range) * chartHeight;
      if (i === 0) {
        path += `M ${x} ${y}`;
      } else {
        path += ` L ${x} ${y}`;
      }
    });
    return path;
  };

  const getPointPosition = (index) => {
    const width = chartData.length * 45 + 20;
    const height = 180;
    const padding = { top: 20, bottom: 20, left: 10, right: 10 };
    const chartHeight = height - padding.top - padding.bottom;
    const chartWidth = width - padding.left - padding.right;
    const x = padding.left + (index / (chartData.length - 1)) * chartWidth;
    const y = padding.top + chartHeight - ((chartData[index].value - minValue) / range) * chartHeight;
    return { x, y };
  };

  const avgSys = Math.round(data.reduce((acc, d) => {
    const [sys] = d.bp.split('/').map(Number);
    return acc + sys;
  }, 0) / data.length);
  const avgDia = Math.round(data.reduce((acc, d) => {
    const [, dia] = d.bp.split('/').map(Number);
    return acc + dia;
  }, 0) / data.length);
  const avgOxygen = Math.round(data.reduce((acc, d) => acc + d.oxygen, 0) / data.length);
  const avgTemp = (data.reduce((acc, d) => acc + d.temp, 0) / data.length).toFixed(1);
  const avgHR = Math.round(data.reduce((acc, d) => acc + d.hr, 0) / data.length);

  const getVitalLabel = () => {
    if (selectedVital === 'bp') return 'Blood Pressure (Systolic)';
    if (selectedVital === 'oxygen') return 'Oxygen Saturation';
    if (selectedVital === 'temp') return 'Temperature';
    return 'Heart Rate';
  };

  const getVitalUnit = () => {
    if (selectedVital === 'bp') return 'mmHg';
    if (selectedVital === 'oxygen') return '%';
    if (selectedVital === 'temp') return '°F';
    return 'bpm';
  };

  return (
    <div className="vitals-detail-view">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <button className="btn" onClick={onBack} style={{ padding: '6px 12px', cursor: 'pointer' }}>
          ← Back
        </button>
        <h2 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--color-text-primary)', fontFamily: 'var(--font)' }}>
          <span style={{ color: 'var(--teal)' }}>📊</span> Hourly Vitals Trend
        </h2>
      </div>

      <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', overflowX: 'auto' }}>
        {dates.map(date => (
          <button
            key={date}
            className={`btn ${selectedDate === date ? 'primary' : ''}`}
            onClick={() => setSelectedDate(date)}
            style={{ padding: '6px 14px', fontSize: '12px', whiteSpace: 'nowrap', cursor: 'pointer' }}
          >
            {date}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <button
          className={`btn ${selectedVital === 'all' ? 'primary' : ''}`}
          onClick={() => setSelectedVital('all')}
          style={{ padding: '4px 12px', fontSize: '11px', cursor: 'pointer' }}
        >
          All Vitals
        </button>
        <button
          className={`btn ${selectedVital === 'bp' ? 'primary' : ''}`}
          onClick={() => setSelectedVital('bp')}
          style={{ padding: '4px 12px', fontSize: '11px', cursor: 'pointer' }}
        >
          ❤️ BP
        </button>
        <button
          className={`btn ${selectedVital === 'oxygen' ? 'primary' : ''}`}
          onClick={() => setSelectedVital('oxygen')}
          style={{ padding: '4px 12px', fontSize: '11px', cursor: 'pointer' }}
        >
          🫁 Oxygen
        </button>
        <button
          className={`btn ${selectedVital === 'temp' ? 'primary' : ''}`}
          onClick={() => setSelectedVital('temp')}
          style={{ padding: '4px 12px', fontSize: '11px', cursor: 'pointer' }}
        >
          🌡️ Temp
        </button>
      </div>

      <div className="stats-grid" style={{ marginBottom: '16px' }}>
        <div className="stat-card">
          <div className="stat-label">Avg BP</div>
          <div className="stat-value ok">
            {avgSys}<span className="stat-unit">/{avgDia}</span>
          </div>
          <div className="stat-trend" style={{ color: 'var(--color-text-secondary)' }}>mmHg</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Avg Oxygen</div>
          <div className="stat-value ok">
            {avgOxygen}<span className="stat-unit">%</span>
          </div>
          <div className="stat-trend" style={{ color: 'var(--color-text-secondary)' }}>SpO₂</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Avg Temp</div>
          <div className="stat-value ok">
            {avgTemp}<span className="stat-unit">°F</span>
          </div>
          <div className="stat-trend" style={{ color: 'var(--color-text-secondary)' }}>°F</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Avg Heart Rate</div>
          <div className="stat-value ok">
            {avgHR}<span className="stat-unit"> bpm</span>
          </div>
          <div className="stat-trend" style={{ color: 'var(--color-text-secondary)' }}>BPM</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '12px' }}>
        <div className="card-header">
          <span className="card-title">
            <span style={{ color: 'var(--teal)' }}>📈</span> 
            {selectedVital === 'all' ? 'Heart Rate Trend' : getVitalLabel()}
          </span>
          <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
            {selectedVital === 'all' ? 'bpm' : getVitalUnit()}
          </span>
        </div>
        
        <div className="chart-container" style={{ position: 'relative', width: '100%', overflowX: 'auto' }}>
          <svg 
            width={chartData.length * 45 + 20} 
            height="200" 
            viewBox={`0 0 ${chartData.length * 45 + 20} 200`}
            style={{ display: 'block', margin: '0 auto' }}
          >
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const y = 20 + (180 - 40) * (1 - ratio);
              const value = minValue + range * ratio;
              return (
                <g key={ratio}>
                  <line
                    x1="10"
                    y1={y}
                    x2={chartData.length * 45 + 10}
                    y2={y}
                    stroke="#E5E2DC"
                    strokeWidth="0.5"
                    strokeDasharray="4"
                  />
                  <text
                    x="8"
                    y={y + 4}
                    fontSize="9"
                    fill="#6B6A67"
                    fontFamily="var(--font)"
                    textAnchor="end"
                  >
                    {Math.round(value)}
                  </text>
                </g>
              );
            })}

            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0F6E56" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#0F6E56" stopOpacity="0.02" />
              </linearGradient>
            </defs>

            <path
              d={`${generatePath()} L ${chartData.length * 45 + 10} ${180} L 10 ${180} Z`}
              fill="url(#areaGradient)"
            />

            <path
              d={generatePath()}
              stroke="#0F6E56"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {chartData.map((d, i) => {
              const pos = getPointPosition(i);
              const color = getStatusColor(
                selectedVital === 'all' ? 'heart' : selectedVital,
                d.value
              );
              const isHovered = hoveredPoint === i;
              return (
                <g
                  key={i}
                  onMouseEnter={() => setHoveredPoint(i)}
                  onMouseLeave={() => setHoveredPoint(null)}
                  style={{ cursor: 'pointer' }}
                >
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={isHovered ? 7 : 4}
                    fill={isHovered ? '#0F6E56' : color}
                    stroke="white"
                    strokeWidth="2"
                    opacity={isHovered ? 1 : 0.8}
                  />
                  {isHovered && (
                    <>
                      <rect
                        x={pos.x - 30}
                        y={pos.y - 38}
                        width="60"
                        height="28"
                        rx="4"
                        fill="white"
                        stroke="#E5E2DC"
                        strokeWidth="0.5"
                      />
                      <text
                        x={pos.x}
                        y={pos.y - 20}
                        fontSize="9"
                        fill="#1C1B1A"
                        fontFamily="var(--font)"
                        textAnchor="middle"
                        fontWeight="500"
                      >
                        {d.value}{d.unit}
                      </text>
                    </>
                  )}
                </g>
              );
            })}

            {chartData.map((d, i) => {
              const pos = getPointPosition(i);
              return (
                <text
                  key={i}
                  x={pos.x}
                  y="195"
                  fontSize="8"
                  fill="#6B6A67"
                  fontFamily="var(--font)"
                  textAnchor="middle"
                >
                  {d.label}
                </text>
              );
            })}
          </svg>
        </div>

        <div style={{ 
          display: 'flex', 
          gap: '16px', 
          marginTop: '8px', 
          paddingTop: '8px', 
          borderTop: '0.5px solid var(--color-border-tertiary)',
          fontSize: '10px',
          color: 'var(--color-text-secondary)',
          flexWrap: 'wrap'
        }}>
          <span>✅ <span style={{ color: '#0F6E56' }}>Normal</span></span>
          <span>⚠️ <span style={{ color: '#EF9F27' }}>Monitor</span></span>
          <span>🚨 <span style={{ color: '#E24B4A' }}>Alert</span></span>
          {hoveredPoint !== null && (
            <span style={{ fontWeight: '500', color: 'var(--color-text-primary)' }}>
              {chartData[hoveredPoint].label}: {chartData[hoveredPoint].full}
            </span>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '4px' }}>
        {chartData.map((d, i) => {
          const color = getStatusColor(
            selectedVital === 'all' ? 'heart' : selectedVital,
            d.value
          );
          return (
            <div 
              key={i}
              style={{
                background: hoveredPoint === i ? 'var(--teal-light)' : 'var(--color-background-secondary)',
                borderRadius: '4px',
                padding: '4px 6px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s',
                border: hoveredPoint === i ? '0.5px solid var(--teal)' : 'none'
              }}
              onMouseEnter={() => setHoveredPoint(i)}
              onMouseLeave={() => setHoveredPoint(null)}
            >
              <div style={{ fontSize: '8px', color: 'var(--color-text-secondary)' }}>{d.label}</div>
              <div style={{ fontSize: '11px', fontWeight: '600', color: color }}>{d.value}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==================== SCHEDULE SCREEN ====================
function ScheduleScreen() {
  const [medications, setMedications] = useState([
    { id: 0, time: '8:00 AM', name: 'Metformin 500mg', dose: 'With breakfast', taken: true, am: true },
    { id: 1, time: '9:00 AM', name: 'Lisinopril 10mg', dose: 'With water', taken: true, am: true },
    { id: 2, time: '12:00 PM', name: 'Warfarin 5mg', dose: 'Same time daily', taken: true, am: true },
    { id: 3, time: '2:30 PM', name: 'Atorvastatin 20mg', dose: 'Take now', taken: false, am: false },
    { id: 4, time: '8:00 PM', name: 'Metformin 500mg', dose: 'With dinner', taken: false, am: false }
  ]);

  const toggleMed = (id) => {
    setMedications(prev => prev.map(med => 
      med.id === id ? { ...med, taken: !med.taken } : med
    ));
  };

  const takenCount = medications.filter(m => m.taken).length;
  const pct = Math.round((takenCount / medications.length) * 100);

  return (
    <>
      <div className="card">
        <div className="card-header">
          <span className="card-title"><span style={{color:'var(--teal)'}}>📅</span> Today's Medication Schedule</span>
          <span style={{fontSize:'11px',color:'var(--color-text-secondary)'}}>June 2, 2026</span>
        </div>
        <div id="med-schedule">
          {medications.map(med => (
            <div className="sched-row" key={med.id}>
              <div className="sched-time">{med.time}</div>
              <div className={`sched-pill-icon ${med.am ? 'am' : 'pm'}`}>
                <span>💊</span>
              </div>
              <div style={{flex:1}}>
                <div className="sched-name">{med.name}</div>
                <div className="sched-dose">{med.dose}</div>
              </div>
              <div className={`sched-check ${med.taken ? 'done' : ''}`} onClick={() => toggleMed(med.id)}>
                {med.taken && '✓'}
              </div>
            </div>
          ))}
        </div>
        <div style={{marginTop:'12px',paddingTop:'12px',borderTop:'0.5px solid var(--color-border-tertiary)'}}>
          <div style={{display:'flex',justifyContent:'space-between',fontSize:'12px',color:'var(--color-text-secondary)',marginBottom:'4px'}}>
            <span>Adherence today</span><span id="adhere-pct">{pct}%</span>
          </div>
          <div className="progress-bar"><div className={`progress-fill ${pct >= 80 ? '' : pct >= 50 ? 'warn' : 'danger'}`} style={{width:`${pct}%`}}></div></div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title"><span style={{color:'var(--blue)'}}>🔔</span> Caregiver Notification Settings</span>
        </div>
        {['Alert caregiver if missed dose', 'Daily adherence report', 'Emergency BP alert (>140/90)'].map((label, i) => (
          <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',fontSize:'13px',padding:'8px 0',borderTop:i > 0 ? '0.5px solid var(--color-border-tertiary)' : 'none'}}>
            <span>{label}</span>
            <button className="notif-toggle" onClick={(e) => e.target.classList.toggle('off')}></button>
          </div>
        ))}
      </div>
    </>
  );
}

// ==================== CAREGIVER SCREEN ====================
function CaregiverScreen() {
  const [caregivers] = useState([
    { initials: 'SR', name: 'Sarah Reynolds', role: 'Primary Caregiver · Daughter', on: true },
    { initials: 'DK', name: 'Dr. Kim Chen', role: 'Physician · Chesapeake Medical', on: true },
    { initials: 'MP', name: 'Mark Patel', role: 'Pharmacist · CVS #4821', on: false }
  ]);

  const [alertSettings, setAlertSettings] = useState([
    { label: 'Medication missed >1 hour', checked: true },
    { label: 'BP exceeds 140/90', checked: true },
    { label: 'Heart rate outside 50–100 bpm', checked: true },
    { label: 'High-risk interaction detected', checked: false },
    { label: 'Daily wellness check-in missed', checked: false }
  ]);

  const toggleAlert = (index) => {
    setAlertSettings(prev => prev.map((a, i) => 
      i === index ? { ...a, checked: !a.checked } : a
    ));
  };

  return (
    <>
      <div className="card">
        <div className="card-header">
          <span className="card-title"><span style={{color:'var(--teal)'}}>👥</span> Care Team</span>
          <button className="btn sm" onClick={() => alert('Add caregiver: enter name, role, and contact info')}>➕ Add</button>
        </div>
        {caregivers.map((cg, i) => (
          <div className="caregiver-card" key={i}>
            <div className="caregiver-avatar">{cg.initials}</div>
            <div className="caregiver-info">
              <div className="caregiver-name">{cg.name}</div>
              <div className="caregiver-role">{cg.role}</div>
            </div>
            <button className={`notif-toggle ${cg.on ? '' : 'off'}`}></button>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title"><span style={{color:'var(--blue)'}}>📤</span> Alert Settings</span>
        </div>
        <div style={{fontSize:'12px',color:'var(--color-text-secondary)',marginBottom:'8px'}}>Notify care team when:</div>
        {alertSettings.map((alert, i) => (
          <label key={i} style={{display:'flex',alignItems:'center',gap:'8px',fontSize:'13px',padding:'6px 0',cursor:'pointer'}}>
            <input type="checkbox" checked={alert.checked} onChange={() => toggleAlert(i)} style={{accentColor:'var(--teal)'}} />
            {alert.label}
          </label>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title"><span style={{color:'var(--gray)'}}>📜</span> Recent Alerts Sent</span>
        </div>
        <div style={{fontSize:'12px'}}>
          <div style={{padding:'7px 0',borderBottom:'0.5px solid var(--color-border-tertiary)',display:'flex',gap:'8px',alignItems:'flex-start'}}>
            <span style={{color:'var(--amber)'}}>⚠️</span>
            <div><div style={{fontWeight:'500'}}>Missed dose alert</div><div style={{color:'var(--color-text-secondary)',fontSize:'11px'}}>Sent to Sarah · Today 1:30 PM</div></div>
          </div>
          <div style={{padding:'7px 0',display:'flex',gap:'8px',alignItems:'flex-start'}}>
            <span style={{color:'var(--red)'}}>❤️</span>
            <div><div style={{fontWeight:'500'}}>Elevated BP logged: 135/85</div><div style={{color:'var(--color-text-secondary)',fontSize:'11px'}}>Sent to Dr. Kim Chen · Yesterday 3:00 PM</div></div>
          </div>
        </div>
      </div>
    </>
  );
}

// ==================== CHAT SCREEN ====================
function ChatScreen() {
  const [messages, setMessages] = useState([
    { id: 0, sender: 'bot', text: 'Good afternoon, James! How are you feeling today?', time: '2:15 PM' },
    { id: 1, sender: 'bot', text: 'Did you remember to eat before taking your Metformin this morning?', time: '2:15 PM' },
    { id: 2, sender: 'bot', text: 'Also — have you been drinking enough water today? Staying hydrated helps your Lisinopril work effectively.', time: '2:16 PM' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const chatWrapRef = useRef(null);

  useEffect(() => {
    if (chatWrapRef.current) {
      chatWrapRef.current.scrollTop = chatWrapRef.current.scrollHeight;
    }
  }, [messages]);

  const addMessage = (sender, text) => {
    const now = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    setMessages(prev => [...prev, { id: Date.now(), sender, text, time: now }]);
  };

  const handleSend = (text) => {
    if (!text.trim()) return;
    addMessage('user', text);
    setInputValue('');
    setTimeout(() => {
      addMessage('bot', 'I understand. Is there anything specific about your medications or how you\'re feeling that I can help with?');
    }, 600);
  };

  const handleFeel = (text) => {
    handleSend(text);
  };

  return (
    <div className="card" style={{padding:0,overflow:'hidden'}}>
      <div style={{background:'var(--teal)',padding:'10px 14px',display:'flex',alignItems:'center',gap:'8px'}}>
        <div style={{width:'30px',height:'30px',borderRadius:'50%',background:'rgba(255,255,255,0.2)',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <span style={{color:'white',fontSize:'14px'}}>🤖</span>
        </div>
        <div>
          <div style={{color:'white',fontWeight:'500',fontSize:'13px'}}>SignetSure Assistant</div>
          <div style={{color:'rgba(255,255,255,0.7)',fontSize:'11px'}}>Side effect monitoring · 24/7</div>
        </div>
      </div>
      <div style={{padding:'12px'}}>
        <div className="chat-wrap" ref={chatWrapRef}>
          {messages.map((msg) => (
            <div key={msg.id} className={`chat-msg ${msg.sender}`}>
              <div className="chat-bubble">{msg.text}</div>
              <div className="chat-time">{msg.time}</div>
              {msg.sender === 'bot' && msg.id === 1 && (
                <div className="feeling-btns">
                  <button className="feel-btn" onClick={() => handleFeel('Yes, I ate')}>Yes, I ate</button>
                  <button className="feel-btn" onClick={() => handleFeel('Forgot to eat')}>Forgot to eat</button>
                </div>
              )}
              {msg.sender === 'bot' && msg.id === 2 && (
                <div className="feeling-btns">
                  <button className="feel-btn" onClick={() => handleFeel('Drinking plenty')}>Drinking plenty</button>
                  <button className="feel-btn" onClick={() => handleFeel('Not enough water today')}>Need to drink more</button>
                  <button className="feel-btn" onClick={() => handleFeel('I am experiencing side effects: dizziness')}>Side effects</button>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="chat-input-row">
          <input 
            type="text" 
            placeholder="Type a message..." 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend(inputValue)}
          />
          <button className="chat-send" onClick={() => handleSend(inputValue)}>
            <span>📤</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== ALERTS SCREEN ====================
function AlertsScreen() {
  return (
    <>
      <div className="section-label">Active Alerts</div>
      
      <div className="high-risk-ping" style={{flexDirection:'column',alignItems:'flex-start',gap:'6px'}}>
        <div style={{display:'flex',gap:'8px',alignItems:'center',width:'100%'}}>
          <span style={{color:'var(--red)',fontSize:'18px'}}>⚠️</span>
          <div style={{flex:1}}>
            <div style={{fontSize:'13px',fontWeight:'600',color:'var(--red)'}}>High-Risk Drug Interaction</div>
            <div style={{fontSize:'12px',color:'var(--color-text-secondary)'}}>Warfarin + Aspirin · Increased bleeding risk</div>
          </div>
          <button className="btn sm" style={{borderColor:'#F09595',color:'var(--red)'}}>Dismiss</button>
        </div>
      </div>

      <div className="geo-alert">
        <span>📍</span>
        <div className="geo-alert-text">
          <strong>Location Alert — CVS Pharmacy nearby</strong>
          <span>Entering pharmacy zone. 3 interaction alerts active. Auto-alert sent to Dr. Kim Chen.</span>
        </div>
      </div>

      <div style={{background:'var(--blue-light)',border:'0.5px solid #85B7EB',borderRadius:'var(--radius-sm)',padding:'10px 12px',display:'flex',gap:'10px',marginBottom:'8px'}}>
        <span style={{color:'var(--blue)',fontSize:'16px'}}>⏰</span>
        <div>
          <div style={{fontSize:'12px',fontWeight:'600',color:'var(--blue)'}}>Missed Dose — Atorvastatin</div>
          <div style={{fontSize:'11px',color:'var(--color-text-secondary)'}}>Scheduled 2:30 PM · Now 35 min overdue · Caregiver notified</div>
        </div>
      </div>

      <div className="section-label">Notification History</div>
      <div className="card" style={{padding:0}}>
        <div style={{padding:'10px 14px',borderBottom:'0.5px solid var(--color-border-tertiary)',fontSize:'12px',display:'flex',gap:'8px',alignItems:'center'}}>
          <span style={{color:'var(--teal)'}}>❤️</span>
          <div><div style={{fontWeight:'500'}}>BP returned to normal range</div><div style={{color:'var(--color-text-secondary)',fontSize:'11px'}}>Today 12:00 PM</div></div>
        </div>
        <div style={{padding:'10px 14px',borderBottom:'0.5px solid var(--color-border-tertiary)',fontSize:'12px',display:'flex',gap:'8px',alignItems:'center'}}>
          <span style={{color:'var(--teal)'}}>📍</span>
          <div><div style={{fontWeight:'500'}}>Walgreens — GPS proximity alert</div><div style={{color:'var(--color-text-secondary)',fontSize:'11px'}}>Today 10:34 AM</div></div>
        </div>
        <div style={{padding:'10px 14px',fontSize:'12px',display:'flex',gap:'8px',alignItems:'center'}}>
          <span style={{color:'var(--teal)'}}>💊</span>
          <div><div style={{fontWeight:'500'}}>Morning medications confirmed</div><div style={{color:'var(--color-text-secondary)',fontSize:'11px'}}>Today 9:05 AM</div></div>
        </div>
      </div>
    </>
  );
}

// ==================== PREFERENCES SCREEN ====================
function PreferencesScreen() {
  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title"><span style={{color:'var(--teal)'}}>⚙️</span> User Preferences</span>
      </div>
      <div style={{marginBottom:'12px'}}>
        <div style={{fontSize:'12px',fontWeight:'500',marginBottom:'6px'}}>Notifications</div>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'6px 0',borderBottom:'0.5px solid var(--color-border-tertiary)'}}>
          <span style={{fontSize:'13px'}}>Push Notifications</span>
          <button className="notif-toggle"></button>
        </div>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'6px 0',borderBottom:'0.5px solid var(--color-border-tertiary)'}}>
          <span style={{fontSize:'13px'}}>Email Reminders</span>
          <button className="notif-toggle"></button>
        </div>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'6px 0'}}>
          <span style={{fontSize:'13px'}}>SMS Alerts</span>
          <button className="notif-toggle off"></button>
        </div>
      </div>
      <div style={{marginBottom:'12px'}}>
        <div style={{fontSize:'12px',fontWeight:'500',marginBottom:'6px'}}>Appearance</div>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'6px 0',borderBottom:'0.5px solid var(--color-border-tertiary)'}}>
          <span style={{fontSize:'13px'}}>Dark Mode</span>
          <button className="notif-toggle off"></button>
        </div>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'6px 0'}}>
          <span style={{fontSize:'13px'}}>Font Size</span>
          <select style={{padding:'4px 8px',border:'0.5px solid var(--color-border-secondary)',borderRadius:'6px',fontFamily:'var(--font)',fontSize:'12px',background:'var(--color-background-primary)'}}>
            <option>Small</option>
            <option selected>Medium</option>
            <option>Large</option>
          </select>
        </div>
      </div>
      <div>
        <div style={{fontSize:'12px',fontWeight:'500',marginBottom:'6px'}}>Privacy</div>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'6px 0',borderBottom:'0.5px solid var(--color-border-tertiary)'}}>
          <span style={{fontSize:'13px'}}>Share Health Data</span>
          <button className="notif-toggle"></button>
        </div>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'6px 0'}}>
          <span style={{fontSize:'13px'}}>Location Services</span>
          <button className="notif-toggle"></button>
        </div>
      </div>
    </div>
  );
}

// ==================== BILLING SCREEN ====================
function BillingScreen() {
  return (
    <>
      <div className="card">
        <div className="card-header">
          <span className="card-title"><span style={{color:'var(--teal)'}}>💳</span> Billing & Payment</span>
        </div>
        <div style={{marginBottom:'12px'}}>
          <div style={{fontSize:'12px',fontWeight:'500',marginBottom:'8px'}}>Payment Methods</div>
          <div style={{background:'var(--color-background-secondary)',borderRadius:'var(--radius-sm)',padding:'10px 12px',display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'6px'}}>
            <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
              <span style={{fontSize:'20px'}}>💳</span>
              <div>
                <div style={{fontSize:'13px',fontWeight:'500'}}>Visa ending in 4242</div>
                <div style={{fontSize:'11px',color:'var(--color-text-secondary)'}}>Expires 12/2028</div>
              </div>
            </div>
            <span style={{fontSize:'11px',color:'var(--teal)',fontWeight:'500'}}>Default</span>
          </div>
          <div style={{background:'var(--color-background-secondary)',borderRadius:'var(--radius-sm)',padding:'10px 12px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
              <span style={{fontSize:'20px'}}>💳</span>
              <div>
                <div style={{fontSize:'13px',fontWeight:'500'}}>Mastercard ending in 8888</div>
                <div style={{fontSize:'11px',color:'var(--color-text-secondary)'}}>Expires 09/2027</div>
              </div>
            </div>
            <button className="btn sm">Remove</button>
          </div>
        </div>
        <button className="btn primary" style={{width:'100%',justifyContent:'center'}}>
          + Add Payment Method
        </button>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title"><span style={{color:'var(--blue)'}}>📊</span> Billing History</span>
        </div>
        <div style={{fontSize:'12px'}}>
          <div style={{padding:'8px 0',borderBottom:'0.5px solid var(--color-border-tertiary)',display:'flex',justifyContent:'space-between'}}>
            <div>
              <div style={{fontWeight:'500'}}>Subscription - Monthly</div>
              <div style={{color:'var(--color-text-secondary)',fontSize:'11px'}}>June 1, 2026</div>
            </div>
            <div style={{fontWeight:'500',color:'var(--teal)'}}>$29.99</div>
          </div>
          <div style={{padding:'8px 0',borderBottom:'0.5px solid var(--color-border-tertiary)',display:'flex',justifyContent:'space-between'}}>
            <div>
              <div style={{fontWeight:'500'}}>Subscription - Monthly</div>
              <div style={{color:'var(--color-text-secondary)',fontSize:'11px'}}>May 1, 2026</div>
            </div>
            <div style={{fontWeight:'500',color:'var(--teal)'}}>$29.99</div>
          </div>
          <div style={{padding:'8px 0',display:'flex',justifyContent:'space-between'}}>
            <div>
              <div style={{fontWeight:'500'}}>Subscription - Monthly</div>
              <div style={{color:'var(--color-text-secondary)',fontSize:'11px'}}>April 1, 2026</div>
            </div>
            <div style={{fontWeight:'500',color:'var(--teal)'}}>$29.99</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;