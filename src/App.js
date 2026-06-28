// src/App.js
import React, { useState, useRef, useEffect } from 'react';
import './App.css';

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [ageSelected, setAgeSelected] = useState(null);
  const [scanStatus, setScanStatus] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [drugSearch, setDrugSearch] = useState('');
  const [medications, setMedications] = useState([
    { id: '1', name: 'Metformin', dose: '500mg', time: '8:00 AM', instructions: 'With breakfast', taken: true, period: 'am' },
    { id: '2', name: 'Lisinopril', dose: '10mg', time: '9:00 AM', instructions: 'With water', taken: true, period: 'am' },
    { id: '3', name: 'Warfarin', dose: '5mg', time: '12:00 PM', instructions: 'Same time daily', taken: true, period: 'am' },
    { id: '4', name: 'Atorvastatin', dose: '20mg', time: '2:30 PM', instructions: 'Take now', taken: false, period: 'pm' },
    { id: '5', name: 'Metformin', dose: '500mg', time: '8:00 PM', instructions: 'With dinner', taken: false, period: 'pm' },
  ]);
  const [supplements, setSupplements] = useState([
    { id: '1', name: 'Fish Oil', icon: 'leaf', selected: false },
    { id: '2', name: 'Vitamin D', icon: 'sun', selected: true },
    { id: '3', name: "St. John's Wort", icon: 'herb', selected: false },
    { id: '4', name: 'Melatonin', icon: 'leaf', selected: false },
    { id: '5', name: 'Magnesium', icon: 'flask', selected: false },
    { id: '6', name: 'Zinc', icon: 'flask', selected: true },
  ]);
  const [chatMessages, setChatMessages] = useState([
    { id: '1', text: 'Good afternoon, James! How are you feeling today?', sender: 'bot', timestamp: new Date() },
    { id: '2', text: 'Did you remember to eat before taking your Metformin this morning?', sender: 'bot', timestamp: new Date() },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [bpSys, setBpSys] = useState(118);
  const [bpDia, setBpDia] = useState(76);
  const [heartRate, setHeartRate] = useState(68);
  const [adherence, setAdherence] = useState(60);
  const [caregivers] = useState([
    { id: '1', name: 'Sarah Reynolds', role: 'Primary Caregiver · Daughter', avatar: 'SR', notifications: true },
    { id: '2', name: 'Dr. Kim Chen', role: 'Physician · Chesapeake Medical', avatar: 'DK', notifications: true, color: '#3B6D11' },
    { id: '3', name: 'Mark Patel', role: 'Pharmacist · CVS #4821', avatar: 'MP', notifications: false, color: '#BA7517' },
  ]);
  const [alertSettings, setAlertSettings] = useState({
    missedMedication: true,
    elevatedBP: true,
    heartRateOutOfRange: true,
    highRiskInteraction: false,
    dailyWellnessMissed: false,
  });
  const [geoNotifications, setGeoNotifications] = useState(true);
  const [bannerVisible, setBannerVisible] = useState(true);
  const [bpLogMessage, setBpLogMessage] = useState('');
  const chatRef = useRef(null);

  const drugs = [
    {
      name: 'Warfarin',
      brand: 'Coumadin',
      type: 'Blood thinner',
      dose: '5mg daily',
      interactions: [
        { name: 'Aspirin', severity: 'high' },
        { name: 'Ibuprofen', severity: 'high' },
        { name: 'Vitamin K', severity: 'moderate' },
        { name: 'Leafy greens', severity: 'moderate' },
        { name: 'Acetaminophen', severity: 'low' },
      ],
    },
    {
      name: 'Lisinopril',
      brand: 'Zestril',
      type: 'ACE inhibitor',
      dose: '10mg daily',
      interactions: [
        { name: 'Potassium', severity: 'moderate' },
        { name: 'NSAIDs', severity: 'moderate' },
        { name: 'Bananas', severity: 'low' },
      ],
    },
    {
      name: 'Metformin',
      brand: 'Glucophage',
      type: 'Diabetes',
      dose: '500mg twice daily',
      interactions: [
        { name: 'Alcohol', severity: 'moderate' },
        { name: 'Caffeine', severity: 'low' },
      ],
    },
  ];

  const chatBotReplies = {
    'yes, i ate breakfast': 'Great! Eating with Metformin helps reduce stomach upset. Keep it up!',
    'yes, i ate': 'Great! Eating with Metformin helps reduce stomach upset. Keep it up!',
    'forgot to eat': 'Please eat something now before taking your Metformin — even a small snack. Taking it on an empty stomach can cause nausea.',
    'yes, well hydrated': 'Excellent! Staying hydrated helps your Lisinopril work effectively and keeps your BP stable.',
    'drinking plenty': 'Excellent! Staying hydrated helps your Lisinopril work effectively and keeps your BP stable.',
    'not enough water today': 'Try to drink 6-8 glasses of water today. Dehydration can raise blood pressure and interact with your medications.',
    'need to drink more': 'Try to drink 6-8 glasses of water today. Dehydration can raise blood pressure and interact with your medications.',
    'side effects: dizziness': 'Dizziness can be a side effect of Lisinopril. Please sit down if you feel unsteady. If it persists, contact Dr. Kim Chen. Alerting your care team now.',
    'i am experiencing side effects: dizziness': 'Dizziness can be a side effect of Lisinopril. Please sit down if you feel unsteady. If it persists, contact Dr. Kim Chen. Alerting your care team now.',
    'default': 'I understand. Is there anything specific about your medications or how you\'re feeling that I can help with?',
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const switchTab = (tab) => {
    setActiveTab(tab);
  };

  const handleAgeSelect = (age) => {
    setAgeSelected(age);
  };

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
        setScanStatus('Verified — James Mitchell · Access granted');
      }
    }, 900);
  };

  const getFilteredDrugs = () => {
    if (!drugSearch.trim()) return drugs;
    return drugs.filter(drug => 
      drug.name.toLowerCase().includes(drugSearch.toLowerCase()) ||
      (drug.brand && drug.brand.toLowerCase().includes(drugSearch.toLowerCase()))
    );
  };

  const toggleSupplement = (id) => {
    setSupplements(prev => 
      prev.map(supp => 
        supp.id === id ? { ...supp, selected: !supp.selected } : supp
      )
    );
  };

  const getSupplementAlert = () => {
    const selected = supplements.filter(s => s.selected);
    if (selected.some(s => s.name === "St. John's Wort")) {
      return (
        <React.Fragment>
          <i className="ti ti-alert-triangle" aria-hidden="true"></i>
          <span> St. John's Wort may interact with Warfarin — reduces anticoagulant effect significantly.</span>
        </React.Fragment>
      );
    }
    if (selected.length > 0) {
      return (
        <React.Fragment>
          <i className="ti ti-check-circle" aria-hidden="true"></i>
          <span> No major interactions detected with selected supplements.</span>
        </React.Fragment>
      );
    }
    return (
      <React.Fragment>
        <i className="ti ti-info-circle" aria-hidden="true"></i>
        <span> Select supplements to check for interactions.</span>
      </React.Fragment>
    );
  };

  const toggleMedication = (id) => {
    setMedications(prev => {
      const updated = prev.map(med => 
        med.id === id ? { ...med, taken: !med.taken } : med
      );
      const takenCount = updated.filter(m => m.taken).length;
      const pct = Math.round((takenCount / updated.length) * 100);
      setAdherence(pct);
      return updated;
    });
  };

  const handleLogBP = () => {
    const sysInput = document.getElementById('sys-in')?.value;
    const diaInput = document.getElementById('dia-in')?.value;
    
    if (!sysInput || !diaInput) {
      setBpLogMessage('Please enter both values.');
      return;
    }
    
    const sys = parseInt(sysInput);
    const dia = parseInt(diaInput);
    setBpSys(sys);
    setBpDia(dia);
    
    if (sys > 139 || dia > 89) {
      setBpLogMessage('Elevated BP — caregiver alerted!');
    } else {
      setBpLogMessage('Reading logged and synced to CRISP.');
    }
    
    const sysIn = document.getElementById('sys-in');
    const diaIn = document.getElementById('dia-in');
    if (sysIn) sysIn.value = '';
    if (diaIn) diaIn.value = '';
  };

  const sendChatMessage = (text) => {
    const userMsg = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };
    setChatMessages(prev => [...prev, userMsg]);

    const lower = text.toLowerCase();
    let reply = chatBotReplies['default'];
    Object.keys(chatBotReplies).forEach(key => {
      if (lower.includes(key)) reply = chatBotReplies[key];
    });

    setTimeout(() => {
      const botMsg = {
        id: (Date.now() + 1).toString(),
        text: reply,
        sender: 'bot',
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, botMsg]);
    }, 700);
  };

  const handleChatSend = () => {
    if (!chatInput.trim()) return;
    sendChatMessage(chatInput);
    setChatInput('');
  };

  const handleFeelingClick = (text) => {
    sendChatMessage(text);
  };

  const getSeverityTag = (severity) => {
    const classes = {
      high: 'tag-high',
      moderate: 'tag-mod',
      low: 'tag-low',
    };
    const labels = {
      high: 'HIGH RISK',
      moderate: 'Moderate',
      low: 'Low',
    };
    return <span className={`interaction-tag ${classes[severity]}`}>{labels[severity]}</span>;
  };

  const getTabIcon = (tab) => {
    const icons = {
      home: 'home',
      biometric: 'face-id',
      drugs: 'pill',
      vitals: 'heart-rate-monitor',
      schedule: 'calendar',
      caregiver: 'users',
      chat: 'message',
      alerts: 'bell'
    };
    return icons[tab] || 'circle';
  };

  const renderHome = () => (
    <>
      {bannerVisible && (
        <div className="push-banner">
          <i className="ti ti-map-pin" aria-hidden="true"></i>
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
          <div className="stat-value ok">{bpSys}<span className="stat-unit">/{bpDia}</span></div>
          <div className="stat-trend" style={{ color: 'var(--teal)' }}>
            <i className="ti ti-arrow-down-right" aria-hidden="true" style={{ fontSize: '11px' }}></i> Normal range
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Heart Rate</div>
          <div className="stat-value ok">{heartRate}<span className="stat-unit"> bpm</span></div>
          <div className="stat-trend" style={{ color: 'var(--teal)' }}>
            <i className="ti ti-activity" aria-hidden="true" style={{ fontSize: '11px' }}></i> Resting normal
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Medications Today</div>
          <div className="stat-value warn">{medications.filter(m => m.taken).length}<span className="stat-unit">/{medications.length}</span></div>
          <div className="progress-bar">
            <div className={`progress-fill ${adherence >= 80 ? 'ok' : adherence >= 50 ? 'warn' : 'danger'}`} style={{ width: `${adherence}%` }}></div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Interactions Flagged</div>
          <div className="stat-value danger">2</div>
          <div className="stat-trend" style={{ color: 'var(--red)', fontSize: '11px' }}>Requires attention</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title"><i className="ti ti-clock" aria-hidden="true" style={{ color: 'var(--teal)' }}></i> Next Dose</span>
          <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>2:30 PM</span>
        </div>
        <div className="sched-row" style={{ border: 'none', padding: '4px 0' }}>
          <div className="sched-pill-icon pm"><i className="ti ti-pill" aria-hidden="true"></i></div>
          <div style={{ flex: 1 }}>
            <div className="sched-name">Lisinopril 10mg</div>
            <div className="sched-dose">Take with water · 1 tablet</div>
          </div>
          <button className="btn sm primary" onClick={() => switchTab('schedule')}>View Schedule</button>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title"><i className="ti ti-shield-check" aria-hidden="true" style={{ color: 'var(--teal)' }}></i> System Integrations</span>
        </div>
        <div className="integration-row">
          <div className="int-icon blue"><i className="ti ti-database" aria-hidden="true"></i></div>
          <div className="int-info">
            <div className="int-name">Chesapeake CRISP</div>
            <div className="int-status connected"><i className="ti ti-circle-check" aria-hidden="true" style={{ fontSize: '10px' }}></i> Connected</div>
          </div>
          <button className="int-btn active" onClick={() => switchTab('vitals')}>View Data</button>
        </div>
        <div className="integration-row">
          <div className="int-icon green"><i className="ti ti-clipboard-list" aria-hidden="true"></i></div>
          <div className="int-info">
            <div className="int-name">PDMP</div>
            <div className="int-status connected"><i className="ti ti-circle-check" aria-hidden="true" style={{ fontSize: '10px' }}></i> Synced</div>
          </div>
          <button className="int-btn active">View Rx</button>
        </div>
      </div>

      <div className="card" style={{ background: 'var(--teal-light)', borderColor: '#9FE1CB' }}>
        <div className="card-header">
          <span className="card-title" style={{ color: 'var(--teal)' }}><i className="ti ti-message-chatbot" aria-hidden="true"></i> AI Assistant</span>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--teal)', marginBottom: '10px' }}>How are you feeling today, James?</p>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <button className="feel-btn" onClick={() => { switchTab('chat'); handleFeelingClick('Great'); }}>Great</button>
          <button className="feel-btn" onClick={() => { switchTab('chat'); handleFeelingClick('Side effects'); }}>Side effects</button>
          <button className="feel-btn" onClick={() => { switchTab('chat'); handleFeelingClick('Not great'); }}>Not great</button>
        </div>
      </div>
    </>
  );

  const renderBiometric = () => (
    <>
      <div className="bio-gate">
        <div className="face-ring">
          <i className="ti ti-user-circle" aria-hidden="true"></i>
          <div className="scan-line"></div>
        </div>
        <p style={{ fontWeight: '600', fontSize: '15px', marginBottom: '6px' }}>Biometric Verification</p>
        <p className="bio-status">Facial recognition for secure pharmacy access</p>
        <div className="consent-box">
          <strong style={{ color: 'var(--blue)', display: 'block', marginBottom: '4px' }}>
            <i className="ti ti-lock" aria-hidden="true"></i> Consent Required
          </strong>
          By proceeding, you consent to biometric data collection for identity verification purposes per HIPAA guidelines. Data is encrypted and not shared with third parties.
        </div>
        <div className="section-label" style={{ marginTop: '0' }}>Age Verification</div>
        <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>I confirm I am:</p>
        <div className="age-verify">
          <button 
            className={`age-btn ${ageSelected === '13-17' ? 'selected' : ''}`} 
            onClick={() => handleAgeSelect('13-17')}
          >
            13–17 years
          </button>
          <button 
            className={`age-btn ${ageSelected === '18+' ? 'selected' : ''}`} 
            onClick={() => handleAgeSelect('18+')}
          >
            18+ years
          </button>
        </div>
        <button 
          className="btn primary" 
          style={{ width: '100%', justifyContent: 'center', marginTop: '8px', borderRadius: '10px' }} 
          onClick={startScan}
          disabled={isScanning}
        >
          <i className="ti ti-face-id" aria-hidden="true"></i> Begin Face Scan
        </button>
        <p id="scan-status" style={{ fontSize: '12px', color: 'var(--teal)', marginTop: '10px', minHeight: '18px' }}>{scanStatus}</p>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title"><i className="ti ti-map-pin" aria-hidden="true" style={{ color: 'var(--amber)' }}></i> Geographic Alerts</span>
          <span style={{ fontSize: '11px', background: 'var(--green-light)', color: 'var(--green)', padding: '2px 8px', borderRadius: '12px', fontWeight: '500' }}>GPS Active</span>
        </div>
        <div className="geo-alert">
          <i className="ti ti-alert-triangle" aria-hidden="true"></i>
          <div className="geo-alert-text">
            <strong>Walgreens #4821 — 0.3mi</strong>
            <span>3 of your prescriptions filled here. Drug interaction alerts will trigger automatically.</span>
          </div>
        </div>
        <div className="store-map">
          <div className="map-dot"></div>
          <div className="map-label">GPS · Public coordinates</div>
        </div>
        <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Push notifications</span>
          <button 
            className={`notif-toggle ${geoNotifications ? '' : 'off'}`} 
            onClick={() => setGeoNotifications(!geoNotifications)}
            aria-label="Toggle GPS notifications"
          ></button>
        </div>
      </div>
    </>
  );

  const renderDrugs = () => (
    <>
      <div className="card">
        <div className="card-title" style={{ marginBottom: '10px' }}>
          <i className="ti ti-alert-circle" aria-hidden="true" style={{ color: 'var(--red)' }}></i> Check Drug Safety
        </div>
        <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '10px' }}>
          Search adverse events, side effects, drug-food interactions
        </p>
        <div className="search-wrap">
          <input 
            type="text" 
            placeholder="Enter medication name (e.g., Aspirin, Lisinopril)..." 
            value={drugSearch}
            onChange={(e) => setDrugSearch(e.target.value)}
          />
          <i className="ti ti-search" aria-hidden="true"></i>
        </div>
        <div className="photo-upload" onClick={() => alert('Camera would open for medication label scan')}>
          <i className="ti ti-camera" aria-hidden="true"></i>
          Photo identification — scan medication label or pill
        </div>
      </div>

      <div id="drug-results">
        <div className="high-risk-ping">
          <i className="ti ti-alert-triangle" aria-hidden="true"></i>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--red)' }}>High-risk interaction detected</div>
            <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Warfarin + Aspirin — increased bleeding risk</div>
          </div>
        </div>
        <div id="drug-list">
          {getFilteredDrugs().map((drug, index) => (
            <div className="drug-result" key={index}>
              <div className="drug-name">{drug.name} {drug.brand && `(${drug.brand})`}</div>
              <div className="drug-meta">{drug.type} · {drug.dose}</div>
              <div>
                {drug.interactions.map((interaction, idx) => (
                  <React.Fragment key={idx}>
                    {getSeverityTag(interaction.severity)}
                    <span style={{ marginRight: '4px' }}>{interaction.name}</span>
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="section-label">Supplement Interactions</div>
      <div className="supp-grid">
        {supplements.map(supp => (
          <div 
            key={supp.id}
            className={`supp-item ${supp.selected ? 'selected' : ''}`} 
            onClick={() => toggleSupplement(supp.id)}
          >
            <i className={`ti ti-${supp.icon}`} aria-hidden="true"></i>
            {supp.name}
          </div>
        ))}
      </div>
      <div style={{ marginTop: '10px', fontSize: '12px', color: 'var(--amber)', background: 'var(--amber-light)', padding: '8px 12px', borderRadius: '8px', display: 'block' }}>
        {getSupplementAlert()}
      </div>
    </>
  );

  const renderVitals = () => (
    <>
      <div className="push-banner">
        <i className="ti ti-heart-rate-monitor" aria-hidden="true"></i>
        <div className="push-banner-text">
          <strong>CRISP Integration Active</strong>
          Syncing with Chesapeake Regional Information System for EHR
        </div>
        <button className="push-banner-close" onClick={() => {}}>×</button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Systolic</div>
          <div className="stat-value ok">{bpSys}</div>
          <div className="stat-trend" style={{ color: 'var(--teal)' }}>mmHg · Normal</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Diastolic</div>
          <div className="stat-value ok">{bpDia}</div>
          <div className="stat-trend" style={{ color: 'var(--teal)' }}>mmHg · Normal</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Heart Rate</div>
          <div className="stat-value ok">{heartRate}</div>
          <div className="stat-trend" style={{ color: 'var(--teal)' }}>bpm · Resting</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">O₂ Saturation</div>
          <div className="stat-value ok">98<span className="stat-unit">%</span></div>
          <div className="stat-trend" style={{ color: 'var(--teal)' }}>SpO₂ · Normal</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title"><i className="ti ti-chart-line" aria-hidden="true" style={{ color: 'var(--teal)' }}></i> 7-Day BP Trend</span>
          <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Last 7 days</span>
        </div>
        <div className="chart-bar-row">
          <div className="chart-bar" style={{ height: '55%' }} title="Mon 115/74"></div>
          <div className="chart-bar" style={{ height: '62%' }} title="Tue 118/76"></div>
          <div className="chart-bar warn" style={{ height: '78%' }} title="Wed 135/85"></div>
          <div className="chart-bar warn" style={{ height: '75%' }} title="Thu 130/82"></div>
          <div className="chart-bar" style={{ height: '60%' }} title="Fri 120/78"></div>
          <div className="chart-bar" style={{ height: '56%' }} title="Sat 116/74"></div>
          <div className="chart-bar" style={{ height: '55%' }} title="Today 118/76"></div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
          <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Today</span>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title"><i className="ti ti-database" aria-hidden="true" style={{ color: 'var(--blue)' }}></i> CRISP & PDMP Sync</span>
        </div>
        <div className="integration-row">
          <div className="int-icon blue"><i className="ti ti-building-hospital" aria-hidden="true"></i></div>
          <div className="int-info">
            <div className="int-name">Chesapeake Regional Info System</div>
            <div className="int-status connected">Last sync: 2 min ago</div>
          </div>
          <button className="int-btn active"><i className="ti ti-refresh" aria-hidden="true"></i> Sync</button>
        </div>
        <div className="integration-row">
          <div className="int-icon green"><i className="ti ti-file-medical" aria-hidden="true"></i></div>
          <div className="int-info">
            <div className="int-name">Prescription Drug Monitoring</div>
            <div className="int-status connected">3 active prescriptions</div>
          </div>
          <button className="int-btn active">View All</button>
        </div>
        <div style={{ paddingTop: '10px' }}>
          <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '6px' }}>Manual entry</div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <input 
              type="number" 
              placeholder="Systolic" 
              style={{ width: '50%', padding: '7px 10px', border: '0.5px solid var(--color-border-secondary)', borderRadius: '8px', fontFamily: 'var(--font)', fontSize: '12px', background: 'var(--color-background-primary)', color: 'var(--color-text-primary)' }} 
              id="sys-in"
            />
            <input 
              type="number" 
              placeholder="Diastolic" 
              style={{ width: '50%', padding: '7px 10px', border: '0.5px solid var(--color-border-secondary)', borderRadius: '8px', fontFamily: 'var(--font)', fontSize: '12px', background: 'var(--color-background-primary)', color: 'var(--color-text-primary)' }} 
              id="dia-in"
            />
          </div>
          <button className="btn primary" style={{ marginTop: '8px', width: '100%', justifyContent: 'center', borderRadius: '10px' }} onClick={handleLogBP}>
            <i className="ti ti-device-heart-monitor" aria-hidden="true"></i> Log Reading
          </button>
          <p style={{ fontSize: '12px', color: bpLogMessage.includes('Elevated') ? 'var(--red)' : 'var(--teal)', marginTop: '6px', minHeight: '16px' }}>{bpLogMessage}</p>
        </div>
      </div>
    </>
  );

  const renderSchedule = () => (
    <>
      <div className="card">
        <div className="card-header">
          <span className="card-title"><i className="ti ti-calendar" aria-hidden="true" style={{ color: 'var(--teal)' }}></i> Today's Medication Schedule</span>
          <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>June 2, 2026</span>
        </div>
        <div id="med-schedule">
          {medications.map(med => (
            <div className="sched-row" key={med.id}>
              <div className="sched-time">{med.time}</div>
              <div className={`sched-pill-icon ${med.period}`}>
                <i className="ti ti-pill" aria-hidden="true"></i>
              </div>
              <div style={{ flex: 1 }}>
                <div className="sched-name">{med.name} {med.dose}</div>
                <div className="sched-dose">{med.instructions}</div>
              </div>
              <div className={`sched-check ${med.taken ? 'done' : ''}`} onClick={() => toggleMedication(med.id)}>
                {med.taken && <i className="ti ti-check" aria-hidden="true"></i>}
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '0.5px solid var(--color-border-tertiary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
            <span>Adherence today</span>
            <span>{adherence}%</span>
          </div>
          <div className="progress-bar">
            <div className={`progress-fill ${adherence >= 80 ? 'ok' : adherence >= 50 ? 'warn' : 'danger'}`} style={{ width: `${adherence}%` }}></div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title"><i className="ti ti-bell" aria-hidden="true" style={{ color: 'var(--blue)' }}></i> Caregiver Notification Settings</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', padding: '8px 0' }}>
          <span>Alert caregiver if missed dose</span>
          <button className={`notif-toggle ${alertSettings.missedMedication ? '' : 'off'}`} onClick={() => setAlertSettings(prev => ({ ...prev, missedMedication: !prev.missedMedication }))}></button>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', padding: '8px 0', borderTop: '0.5px solid var(--color-border-tertiary)' }}>
          <span>Daily adherence report</span>
          <button className={`notif-toggle ${alertSettings.dailyWellnessMissed ? '' : 'off'}`} onClick={() => setAlertSettings(prev => ({ ...prev, dailyWellnessMissed: !prev.dailyWellnessMissed }))}></button>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', padding: '8px 0', borderTop: '0.5px solid var(--color-border-tertiary)' }}>
          <span>Emergency BP alert (&gt;140/90)</span>
          <button className={`notif-toggle ${alertSettings.elevatedBP ? '' : 'off'}`} onClick={() => setAlertSettings(prev => ({ ...prev, elevatedBP: !prev.elevatedBP }))}></button>
        </div>
      </div>
    </>
  );

  const renderCaregiver = () => (
    <>
      <div className="card">
        <div className="card-header">
          <span className="card-title"><i className="ti ti-users" aria-hidden="true" style={{ color: 'var(--teal)' }}></i> Care Team</span>
          <button className="btn sm" onClick={() => alert('Add caregiver: enter name, role, and contact info')}>
            <i className="ti ti-plus" aria-hidden="true"></i> Add
          </button>
        </div>
        {caregivers.map(caregiver => (
          <div className="caregiver-card" key={caregiver.id} style={caregiver.id === caregivers[caregivers.length - 1].id ? { borderBottom: 'none' } : {}}>
            <div className="caregiver-avatar" style={caregiver.color ? { background: `var(--${caregiver.color}-light)`, color: `var(--${caregiver.color})` } : {}}>
              {caregiver.avatar}
            </div>
            <div className="caregiver-info">
              <div className="caregiver-name">{caregiver.name}</div>
              <div className="caregiver-role">{caregiver.role}</div>
            </div>
            <button className={`notif-toggle ${caregiver.notifications ? '' : 'off'}`} onClick={() => {}}></button>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title"><i className="ti ti-send" aria-hidden="true" style={{ color: 'var(--blue)' }}></i> Alert Settings</span>
        </div>
        <div id="alert-settings">
          <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>Notify care team when:</div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', padding: '6px 0', cursor: 'pointer' }}>
            <input type="checkbox" checked={alertSettings.missedMedication} onChange={() => setAlertSettings(prev => ({ ...prev, missedMedication: !prev.missedMedication }))} style={{ accentColor: 'var(--teal)' }} /> Medication missed &gt;1 hour
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', padding: '6px 0', cursor: 'pointer' }}>
            <input type="checkbox" checked={alertSettings.elevatedBP} onChange={() => setAlertSettings(prev => ({ ...prev, elevatedBP: !prev.elevatedBP }))} style={{ accentColor: 'var(--teal)' }} /> BP exceeds 140/90
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', padding: '6px 0', cursor: 'pointer' }}>
            <input type="checkbox" checked={alertSettings.heartRateOutOfRange} onChange={() => setAlertSettings(prev => ({ ...prev, heartRateOutOfRange: !prev.heartRateOutOfRange }))} style={{ accentColor: 'var(--teal)' }} /> Heart rate outside 50–100 bpm
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', padding: '6px 0', cursor: 'pointer' }}>
            <input type="checkbox" checked={alertSettings.highRiskInteraction} onChange={() => setAlertSettings(prev => ({ ...prev, highRiskInteraction: !prev.highRiskInteraction }))} style={{ accentColor: 'var(--teal)' }} /> High-risk interaction detected
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', padding: '6px 0', cursor: 'pointer' }}>
            <input type="checkbox" checked={alertSettings.dailyWellnessMissed} onChange={() => setAlertSettings(prev => ({ ...prev, dailyWellnessMissed: !prev.dailyWellnessMissed }))} style={{ accentColor: 'var(--teal)' }} /> Daily wellness check-in missed
          </label>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title"><i className="ti ti-history" aria-hidden="true" style={{ color: 'var(--gray)' }}></i> Recent Alerts Sent</span>
        </div>
        <div style={{ fontSize: '12px' }}>
          <div style={{ padding: '7px 0', borderBottom: '0.5px solid var(--color-border-tertiary)', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
            <span style={{ color: 'var(--amber)' }}><i className="ti ti-alert-triangle" aria-hidden="true"></i></span>
            <div><div style={{ fontWeight: '500' }}>Missed dose alert</div><div style={{ color: 'var(--color-text-secondary)', fontSize: '11px' }}>Sent to Sarah · Today 1:30 PM</div></div>
          </div>
          <div style={{ padding: '7px 0', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
            <span style={{ color: 'var(--red)' }}><i className="ti ti-heart-rate-monitor" aria-hidden="true"></i></span>
            <div><div style={{ fontWeight: '500' }}>Elevated BP logged: 135/85</div><div style={{ color: 'var(--color-text-secondary)', fontSize: '11px' }}>Sent to Dr. Kim Chen · Yesterday 3:00 PM</div></div>
          </div>
        </div>
      </div>
    </>
  );

  const renderChat = () => (
    <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
      <div style={{ background: 'var(--teal)', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <i className="ti ti-robot" aria-hidden="true" style={{ color: 'white', fontSize: '14px' }}></i>
        </div>
        <div>
          <div style={{ color: 'white', fontWeight: '500', fontSize: '13px' }}>SignetSure Assistant</div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px' }}>Side effect monitoring · 24/7</div>
        </div>
      </div>
      <div style={{ padding: '12px' }}>
        <div className="chat-wrap" ref={chatRef}>
          {chatMessages.map(msg => (
            <div className={`chat-msg ${msg.sender}`} key={msg.id}>
              <div className="chat-bubble">{msg.text}</div>
              <div className="chat-time">{msg.timestamp.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</div>
            </div>
          ))}
        </div>
        <div className="chat-input-row">
          <input 
            type="text" 
            placeholder="Type a message..." 
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleChatSend()}
          />
          <button className="chat-send" onClick={handleChatSend} aria-label="Send message">
            <i className="ti ti-send" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </div>
  );

  const renderAlerts = () => (
    <>
      <div className="section-label">Active Alerts</div>
      <div className="high-risk-ping" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '6px' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', width: '100%' }}>
          <i className="ti ti-alert-triangle" aria-hidden="true" style={{ color: 'var(--red)', fontSize: '18px' }}></i>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--red)' }}>High-Risk Drug Interaction</div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Warfarin + Aspirin · Increased bleeding risk</div>
          </div>
          <button className="btn sm" style={{ borderColor: '#F09595', color: 'var(--red)' }}>Dismiss</button>
        </div>
      </div>

      <div className="geo-alert">
        <i className="ti ti-map-pin" aria-hidden="true"></i>
        <div className="geo-alert-text">
          <strong>Location Alert — CVS Pharmacy nearby</strong>
          <span>Entering pharmacy zone. 3 interaction alerts active. Auto-alert sent to Dr. Kim Chen.</span>
        </div>
      </div>

      <div style={{ background: 'var(--blue-light)', border: '0.5px solid #85B7EB', borderRadius: 'var(--radius-sm)', padding: '10px 12px', display: 'flex', gap: '10px', marginBottom: '8px' }}>
        <i className="ti ti-clock" aria-hidden="true" style={{ color: 'var(--blue)', fontSize: '16px', flexShrink: '0', marginTop: '1px' }}></i>
        <div>
          <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--blue)' }}>Missed Dose — Atorvastatin</div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Scheduled 2:30 PM · Now 35 min overdue · Caregiver notified</div>
        </div>
      </div>

      <div className="section-label">Notification History</div>
      <div className="card" style={{ padding: '0' }}>
        <div style={{ padding: '10px 14px', borderBottom: '0.5px solid var(--color-border-tertiary)', fontSize: '12px', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <i className="ti ti-heart-rate-monitor" aria-hidden="true" style={{ color: 'var(--teal)' }}></i>
          <div><div style={{ fontWeight: '500' }}>BP returned to normal range</div><div style={{ color: 'var(--color-text-secondary)', fontSize: '11px' }}>Today 12:00 PM</div></div>
        </div>
        <div style={{ padding: '10px 14px', borderBottom: '0.5px solid var(--color-border-tertiary)', fontSize: '12px', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <i className="ti ti-map-pin" aria-hidden="true" style={{ color: 'var(--teal)' }}></i>
          <div><div style={{ fontWeight: '500' }}>Walgreens — GPS proximity alert</div><div style={{ color: 'var(--color-text-secondary)', fontSize: '11px' }}>Today 10:34 AM</div></div>
        </div>
        <div style={{ padding: '10px 14px', fontSize: '12px', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <i className="ti ti-pill" aria-hidden="true" style={{ color: 'var(--teal)' }}></i>
          <div><div style={{ fontWeight: '500' }}>Morning medications confirmed</div><div style={{ color: 'var(--color-text-secondary)', fontSize: '11px' }}>Today 9:05 AM</div></div>
        </div>
      </div>
    </>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return renderHome();
      case 'biometric':
        return renderBiometric();
      case 'drugs':
        return renderDrugs();
      case 'vitals':
        return renderVitals();
      case 'schedule':
        return renderSchedule();
      case 'caregiver':
        return renderCaregiver();
      case 'chat':
        return renderChat();
      case 'alerts':
        return renderAlerts();
      default:
        return null;
    }
  };

  return (
    <div className="app" role="main">
      <h2 className="sr-only" style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden' }}>
        SignetSure pharmaceutical app prototype with biometric ID, drug safety, vitals monitoring, caregiver alerts, and chatbot
      </h2>

      <nav className="nav">
        <div className="nav-brand">
          <div className="logo"><i className="ti ti-pill" aria-hidden="true"></i></div>
          SignetSure
        </div>
        <div className="nav-right">
          <button className="btn-nav" onClick={() => switchTab('alerts')}>
            <i className="ti ti-bell" aria-hidden="true"></i> <span className="badge-dot"></span>
          </button>
          <button className="btn-nav primary" onClick={() => switchTab('biometric')}>Verify ID</button>
        </div>
      </nav>

      <div className="tabs" role="tablist">
        {['home', 'biometric', 'drugs', 'vitals', 'schedule', 'caregiver', 'chat', 'alerts'].map(tab => (
          <button 
            key={tab}
            className={`tab ${activeTab === tab ? 'active' : ''}`} 
            onClick={() => switchTab(tab)} 
            role="tab"
          >
            <i className={`ti ti-${getTabIcon(tab)}`} aria-hidden="true"></i>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="screen active">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default App;