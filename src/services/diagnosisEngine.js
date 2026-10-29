/**
 * RepairRadar AI Advisor - Intelligent Diagnostic Engine
 * 
 * Provides problem-specific diagnostic reasoning, confidence estimation,
 * Indian market repair cost benchmarks (in INR), safety warnings, and actionable next steps.
 */

// Device-specific symptom database and fault patterns
const DEVICE_DIAGNOSTIC_RULES = {
  'Washing Machine': [
    {
      keywords: ['leak', 'water leaking', 'puddle', 'spill', 'dripping', 'water on floor', 'overflow'],
      cause: 'Damaged door boot gasket (bellow seal), loose drain pump hose, or cracked water inlet valve',
      secondaryCauses: ['Detergent drawer siphon blockage causing front run-off', 'Ruptured tub-to-pump bellows hose', 'Loose hose clamp on drain pipe'],
      baseConfidence: 86,
      confidenceExplanation: 'High confidence — pooling water indicates an external fluid barrier or hose integrity failure rather than an electrical motor defect.',
      priceMin: 500,
      priceMax: 2200,
      recommendation: 'DIY Inspection First',
      recommendationReason: 'Hose clamps and detergent drawer clogs can be resolved with household tools; door gasket replacement is best left to a pro if torn.',
      redFlags: [
        'Electric shock hazard: Unplug the machine immediately before touching pooled water.',
        'Beware technicians quoting full tub replacement (₹5,000–₹8,000) for a simple ₹300 hose clamp or seal leak.'
      ],
      nextSteps: [
        'Check if water leaks during initial filling (points to inlet valve/hose) or during the spin cycle (points to drain pump/bellows).',
        'Inspect the rubber door seal for small tears, folded lips, or trapped coins/hairpins.',
        'Pull machine slightly away from the wall to see if water originates from the rear inlet connections.'
      ]
    },
    {
      keywords: ['pump', 'does not start', 'wont start', 'not starting', 'no power', 'dead', 'not turning on', 'trip', 'mcb'],
      cause: 'Faulty door interlock switch, blown control board fuse, or tripped thermal overload protector',
      secondaryCauses: ['Main power cord / wall socket fault', 'PCB power supply capacitor breakdown', 'Faulty start/pause push button'],
      baseConfidence: 82,
      confidenceExplanation: 'Strong confidence — failure to initialize is typically caused by safety interlock failure (door lock) or mains power regulation on the control board.',
      priceMin: 800,
      priceMax: 3200,
      recommendation: 'Hire a Pro',
      recommendationReason: 'Requires safe multimeter testing of live 230V lines and board-level micro-switches.',
      redFlags: [
        'Technicians claiming the main motor is completely burned out without testing the door lock switch first.',
        'Never permanently bypass or jump the door safety switch as it poses severe spin safety hazards.'
      ],
      nextSteps: [
        'Verify the power socket with a lamp or phone charger to rule out an MCB / wall switch trip.',
        'Ensure the door clicks firmly into place; many modern washers will not light up or start if the latch sensor fails.',
        'Look for error codes displayed on the screen (e.g., dE, dC, E4) or count LED blink patterns.'
      ]
    },
    {
      keywords: ['not draining', 'drain', 'water inside', 'wont drain', 'stuck water', 'full of water'],
      cause: 'Clogged drain filter / coin trap or seized drain pump impeller',
      secondaryCauses: ['Kinked or blocked external drain hose', 'Failed drain pump motor winding', 'Pressure sensor switch failure'],
      baseConfidence: 88,
      confidenceExplanation: 'Very high confidence — trapped water is almost always an obstruction in the lower drain pump filter or impeller chamber.',
      priceMin: 300,
      priceMax: 1800,
      recommendation: 'DIY Troubleshooting',
      recommendationReason: 'Most washing machine drain filters are accessible from the front lower flap and can be cleared in 10 minutes without tools.',
      redFlags: [
        'Paying more than ₹1,800 for drain issues when it is usually just coins, pins, or lint in the filter trap.',
        'Make sure power is disconnected before putting fingers into the impeller cavity.'
      ],
      nextSteps: [
        'Place a shallow tray and towel beneath the lower front service flap and unscrew the filter knob slowly.',
        'Clear lint, coins, and threads wrapped around the pump propeller, checking if it spins freely with a finger.',
        'Ensure the flexible discharge hose is not kinked behind the machine.'
      ]
    },
    {
      keywords: ['not spinning', 'wont spin', 'drum not rotating', 'drum stuck', 'spin cycle', 'slow spin'],
      cause: 'Worn motor carbon brushes, stretched/snapped drive belt, or faulty motor run capacitor',
      secondaryCauses: ['Unbalanced load safety cutoff', 'Drive motor tachometer sensor failure', 'PCB motor relay solder crack'],
      baseConfidence: 81,
      confidenceExplanation: 'High confidence — if the washer fills and drains but the drum fails to rotate, the mechanical drive link or motor excitation has failed.',
      priceMin: 800,
      priceMax: 3500,
      recommendation: 'Hire a Pro',
      recommendationReason: 'Belt replacement or carbon brush replacement requires removing the rear panel and motor disassembly.',
      redFlags: [
        'Shops recommending a brand new motor (₹4,500+) when replacing ₹350 carbon brushes or a ₹400 belt fixes it.',
        'Check if drum turns freely by hand; if completely jammed, bearings or spider arm may have seized.'
      ],
      nextSteps: [
        'Try spinning the empty drum by hand with the power off. If it feels smooth, motor brushes or belt are likely at fault.',
        'Test with a single light garment to ensure the electronic out-of-balance sensor is not aborting the cycle.',
        'Listen for whether the motor hums when the spin cycle is triggered.'
      ]
    },
    {
      keywords: ['noise', 'banging', 'loud', 'vibrating', 'shaking', 'grinding', 'screeching', 'drum loose'],
      cause: 'Worn drum bearings / spider arm corrosion or failed shock absorber dampers',
      secondaryCauses: ['Foreign metallic object trapped between inner drum and tub', 'Counterweight bolt loosened', 'Transit bolts left installed'],
      baseConfidence: 84,
      confidenceExplanation: 'High confidence — heavy banging during spin cycle is characteristic of suspension failure or worn bearing seals letting water into the ball races.',
      priceMin: 1800,
      priceMax: 4800,
      recommendation: 'Hire a Pro',
      recommendationReason: 'Replacing bearings and spider assembly requires full tub extraction and press tools.',
      redFlags: [
        'Continuing to use the machine with roaring bearings can score the tub shaft beyond repair.',
        'If the machine is older than 8 years, bearing replacement may exceed 50% of the residual value.'
      ],
      nextSteps: [
        'Gently push up on the top rim of the inner metal drum. If it has noticeable vertical play relative to the outer tub, bearings are shot.',
        'Spin the empty drum quickly by hand; a loud rumbling sound like a skateboard confirms bearing wear.',
        'Check that all four feet sit firmly on the floor without wobbling.'
      ]
    }
  ],

  'Refrigerator': [
    {
      keywords: ['not cooling', 'warm', 'cooling not working', 'not cold', 'spoiling', 'ice melting', 'wont cool'],
      cause: 'Clogged condenser coils, failed evaporator fan motor, or malfunctioning defrost thermostat/timer',
      secondaryCauses: ['Faulty PTC compressor start relay', 'Refrigerant (gas) slow leak', 'Worn magnetic door gasket seal'],
      baseConfidence: 83,
      confidenceExplanation: 'High confidence — absence of cooling in frost-free refrigerators usually originates from airflow blockage or defrost cycle failure before actual compressor demise.',
      priceMin: 800,
      priceMax: 3800,
      recommendation: 'Hire a Pro',
      recommendationReason: 'Electrical testing of defrost components or sealed refrigerant lines requires specialized gauges and multimeters.',
      redFlags: [
        'Technicians charging ₹3,000+ for "gas refill" when the real culprit is a ₹400 start relay or dust-choked coils.',
        'Never allow a technician to puncture the sealed cooling system without first confirming the compressor is receiving power.'
      ],
      nextSteps: [
        'Check if the freezer is freezing while the fresh food section below remains warm (points to fan or defrost coil freezing).',
        'Place your hand on the rear or lower compressor; feel if it vibrates and runs warm, or clicks off every 2 minutes.',
        'Inspect the black condenser coils behind or under the fridge and vacuum away accumulated dust and pet hair.'
      ]
    },
    {
      keywords: ['freezer cold', 'fridge warm', 'bottom warm', 'freezer working', 'ice but not cooling'],
      cause: 'Frozen evaporator coil due to defrost heater failure or jammed motorized air damper',
      secondaryCauses: ['Defrost bimetal thermostat failure', 'Evaporator fan blade iced over', 'Blocked return air duct'],
      baseConfidence: 89,
      confidenceExplanation: 'Very high confidence — if the freezer maintains frost while the bottom section is room temperature, the cooling system works but cold air cannot circulate.',
      priceMin: 900,
      priceMax: 2600,
      recommendation: 'DIY Troubleshooting First',
      recommendationReason: 'A complete 24-hour manual defrost can often restore operation temporarily while parts are arranged.',
      redFlags: [
        'Do not chip at ice using a knife or screwdriver; puncturing the aluminum evaporator tube ruins the refrigerator.',
        'Technicians claiming compressor replacement is needed when the freezer is clearly making ice.'
      ],
      nextSteps: [
        'Unplug the refrigerator for 24 hours with doors open and towels placed inside to allow iced air ducts to melt completely.',
        'Listen for whether the fan inside the freezer compartment hums when you depress the door switch.',
        'Check that food items are not physically blocking the air vents in the back panel.'
      ]
    },
    {
      keywords: ['water leak', 'leaking water', 'water inside', 'water puddle', 'vegetable box wet'],
      cause: 'Clogged defrost drain hole / drain trough frozen with ice',
      secondaryCauses: ['Cracked drain pan beneath the compressor', 'Loose water dispenser tubing', 'Door gasket air leak causing excess condensation'],
      baseConfidence: 91,
      confidenceExplanation: 'Very high confidence — water puddling under the vegetable crisper or on the floor under the fridge is the textbook symptom of a clogged condensate drain tube.',
      priceMin: 400,
      priceMax: 1200,
      recommendation: 'DIY Troubleshooting',
      recommendationReason: 'Flushing the defrost drain tube with hot water and a flexible wire is an easy household task.',
      redFlags: [
        'Paying high repair fees for simple defrost drain cleaning.',
        'Always unplug before accessing the rear compressor compartment.'
      ],
      nextSteps: [
        'Inspect the floor of the refrigerator under the lowest vegetable drawer for standing water.',
        'Locate the small drain funnel at the back wall of the freezer/fridge and flush with warm water using a turkey baster or syringe.',
        'Check the plastic drain evaporation pan sitting atop the compressor at the rear.'
      ]
    },
    {
      keywords: ['noise', 'clicking', 'buzzing', 'loud', 'vibrating', 'humming', 'click'],
      cause: 'Failing PTC compressor start relay or compressor overload clicking on and off',
      secondaryCauses: ['Evaporator fan blade hitting frost buildup', 'Condenser fan motor bearing dry', 'Loose compressor vibration mount grommets'],
      baseConfidence: 85,
      confidenceExplanation: 'Strong confidence — a periodic loud "click... hum... click" every few minutes indicates the compressor motor is stalling on startup.',
      priceMin: 700,
      priceMax: 2200,
      recommendation: 'Hire a Pro',
      recommendationReason: 'Replacing the PTC relay and overload protector involves working near high-capacity capacitors and the compressor junction.',
      redFlags: [
        'Mechanics declaring compressor death without swapping in a ₹500 generic PTC relay test unit first.',
        'Running a clicking refrigerator continuously can overheat and burn out the compressor windings.'
      ],
      nextSteps: [
        'Stand by the fridge and note the exact interval between clicks (typically 1 to 3 minutes).',
        'Check if opening the door changes the noise (points to the internal circulation fan).',
        'Verify if the sides or back of the refrigerator feel warm or completely cold.'
      ]
    }
  ],

  'Phone': [
    {
      keywords: ['cracked screen', 'screen broken', 'glass broken', 'display', 'lines', 'black screen', 'touch not working', 'flicker'],
      cause: 'Fractured front digitizer glass and damaged AMOLED / LCD display panel assembly',
      secondaryCauses: ['Loose display flex cable connection', 'Touch controller IC fracture', 'Internal OLED ink leakage (purple/black bleeding)'],
      baseConfidence: 94,
      confidenceExplanation: 'High certainty — physical trauma directly maps to display panel assembly failure.',
      priceMin: 1500,
      priceMax: 7500,
      recommendation: 'Professional Repair',
      recommendationReason: 'Screen replacement requires precision heat guns, water-resistant adhesive gaskets, and ESD-safe pry tools.',
      redFlags: [
        'Shops using cheap TFT aftermarket screens on AMOLED phones (causes high battery drain and dull colors).',
        'Ensure the shop tests biometric fingerprint / Face ID sensors before and after installation.',
        'Beware claims that the motherboard needs replacement for a broken display.'
      ],
      nextSteps: [
        'Test if touch registers on all sections of the screen by dragging an app icon across the entire grid.',
        'Check whether the phone still vibrates, rings, or connects to a computer (proves the motherboard and core OS are intact).',
        'Back up your device data immediately before handing it to any repair technician.'
      ]
    },
    {
      keywords: ['battery', 'draining fast', 'drain', 'swollen', 'battery life', 'dies quickly', 'shut down'],
      cause: 'Chemical lithium-ion battery degradation (cycle count exceeded) or background app power drain',
      secondaryCauses: ['Motherboard PMIC (Power Management IC) leakage', 'Degraded battery temperature sensor', 'Short circuit on charging rail'],
      baseConfidence: 87,
      confidenceExplanation: 'High confidence — lithium batteries naturally lose capacity after 500–800 charge cycles (~2 years of daily use).',
      priceMin: 1200,
      priceMax: 3200,
      recommendation: 'Professional Repair',
      recommendationReason: 'Swollen or degraded phone batteries pose thermal runaway and fire risks if punctured during DIY attempts.',
      redFlags: [
        'SAFETY WARNING: If your phone back cover is bulging or lifting, stop charging immediately — the battery is swollen.',
        'Shops installing unbranded duplicate batteries without overcharge protection ICs.'
      ],
      nextSteps: [
        'Check battery health percentage in Settings (Settings > Battery > Battery Health on iOS, or diagnostic menu on Android).',
        'Check battery usage breakdown to ensure a specific misbehaving app is not holding CPU wake-locks.',
        'Notice if the phone turns off suddenly when battery is around 20–30% (telltale sign of collapsed cell voltage).'
      ]
    },
    {
      keywords: ['charging', 'wont charge', 'not charging', 'loose port', 'slow charging', 'cable falls out'],
      cause: 'Compacted pocket lint inside charging port or oxidised / damaged USB-C / Lightning pins',
      secondaryCauses: ['Defective charging cable or adapter', 'Sub-board / charging daughterboard failure', 'Damaged battery charging IC'],
      baseConfidence: 89,
      confidenceExplanation: 'High confidence — loose cables and intermittent charging are overwhelmingly caused by debris packed into the port socket.',
      priceMin: 200,
      priceMax: 1800,
      recommendation: 'DIY Troubleshooting First',
      recommendationReason: 'Gently cleaning out compacted lint with a wooden toothpick often resolves the issue in 2 minutes for zero cost.',
      redFlags: [
        'Never use metal needles or safety pins to clean the port, as this shorts the live battery pins and ruins the port.',
        'Do not pay for full port replacement before having the port cleaned under magnification.'
      ],
      nextSteps: [
        'Shine a flashlight into the charging port: look for compressed gray lint at the very bottom preventing the cable plug from seating flush.',
        'Gently scrape the bottom of the port with a wooden or plastic toothpick (avoiding the central pin tongue).',
        'Test with an original cable and a different wall charger to isolate cable defects.'
      ]
    },
    {
      keywords: ['water', 'liquid', 'dropped in water', 'wet', 'rain', 'moisture'],
      cause: 'Liquid ingress causing electrolytic corrosion and short circuits across circuit traces',
      secondaryCauses: ['Corroded charging sub-board', 'Damaged backlight booster circuit', 'Microphone/speaker membrane waterlogging'],
      baseConfidence: 85,
      confidenceExplanation: 'High confidence — liquid exposure causes rapid corrosion on energized circuit board traces.',
      priceMin: 1200,
      priceMax: 4500,
      recommendation: 'Professional Repair',
      recommendationReason: 'Requires immediate ultrasonic board cleaning with isopropyl alcohol and corrosion mitigation.',
      redFlags: [
        'DO NOT put the phone in rice — rice dust enters ports, absorbs moisture poorly, and delays vital cleaning.',
        'DO NOT plug the phone into a charger while wet; electricity accelerates irreversible electrolytic corrosion.'
      ],
      nextSteps: [
        'Power the device off immediately and leave it switched off. Do NOT plug in a charger.',
        'Remove SIM tray and shake out excess water. Pat dry with a microfiber towel.',
        'Take it to a repair center with ultrasonic cleaning equipment as soon as possible.'
      ]
    }
  ],

  'Laptop': [
    {
      keywords: ['overheat', 'overheating', 'hot', 'fan loud', 'fan noise', 'thermal throttling', 'fan running constantly'],
      cause: 'Dried out thermal paste (TIM) on CPU/GPU and dust blockage in heatsink exhaust fins',
      secondaryCauses: ['Seized or worn cooling fan bearing', 'Background malware or high CPU utilization process', 'Blocked intake vents from lap use'],
      baseConfidence: 91,
      confidenceExplanation: 'High confidence — thermal throttling and continuous loud fan spin are classic symptoms of degraded thermal interface material and clogged heatsinks.',
      priceMin: 800,
      priceMax: 2200,
      recommendation: 'Professional Repair or DIY (if experienced)',
      recommendationReason: 'Internal deep cleaning and repasting with high-grade thermal paste (e.g., Arctic MX-4) solves over 90% of laptop overheating.',
      redFlags: [
        'Technicians quoting ₹5,000+ for motherboard repairs when simple dust cleaning and repasting fixes the problem.',
        'When blowing compressed air, always hold the fan blade still; free-spinning fan blades generate back-EMF voltage that can fry motherboard regulator chips.'
      ],
      nextSteps: [
        'Open Task Manager (Ctrl+Shift+Esc) to see if an unexpected background process is pegging the CPU at 100%.',
        'Feel whether hot air is actively exhausting from the side/rear vents; if the laptop is burning hot but vent air is weak, the heatsink grill is clogged with dust felt.',
        'Always use the laptop on a hard, flat desk rather than beds, blankets, or cushions that block intake vents.'
      ]
    },
    {
      keywords: ['wont turn on', 'not turning on', 'dead', 'no power', 'black screen', 'not starting', 'power button'],
      cause: 'Faulty DC power adapter, drained CMOS/main battery, or shorted power rail MOSFET on motherboard',
      secondaryCauses: ['Corrupted BIOS firmware', 'Blown input fuse on motherboard charging circuit', 'Faulty power button flex ribbon'],
      baseConfidence: 80,
      confidenceExplanation: 'Moderate to high confidence — complete lack of power is either external charging supply failure or motherboard power management rail short.',
      priceMin: 1000,
      priceMax: 4500,
      recommendation: 'Hire a Pro',
      recommendationReason: 'Requires circuit tracing and component-level micro-soldering on 19V power rails.',
      redFlags: [
        'Technicians demanding immediate complete motherboard replacement without attempting chip-level MOSFET/fuse repair.',
        'Always ask for your old replaced parts back to prevent bogus part-swap claims.'
      ],
      nextSteps: [
        'Perform a hard EC reset: Disconnect charger, hold power button down continuously for 30 seconds, then reconnect charger and try starting.',
        'Check if the small charging LED indicator light turns on when plugging in the AC adapter.',
        'Try another compatible charger to eliminate a broken cable or burnt adapter tip.'
      ]
    },
    {
      keywords: ['battery', 'not charging', 'plugged in not charging', 'battery dead', 'battery drain'],
      cause: 'Depleted battery cell capacity, broken DC jack pin, or worn battery charging IC',
      secondaryCauses: ['Operating system battery driver glitch', 'Damaged center data pin on power adapter barrel connector', 'Motherboard charging MOSFET breakdown'],
      baseConfidence: 86,
      confidenceExplanation: 'High confidence — battery failing to hold charge or saying "plugged in, not charging" indicates either cell cycle exhaustion or DC charging rail disconnect.',
      priceMin: 1500,
      priceMax: 4200,
      recommendation: 'Professional Repair',
      recommendationReason: 'Replacement laptop batteries must be verified OEM or tested certified compatible units.',
      redFlags: [
        'Buying counterfeit unbranded replacement batteries online that lack thermal cutoff sensors.',
        'Confirm whether the issue is the charging adapter before replacing the internal battery.'
      ],
      nextSteps: [
        'Generate a Windows battery health report: open PowerShell as Administrator and run "powercfg /batteryreport".',
        'Inspect the DC charging barrel or USB-C port for bent central pins or loose mechanical connection.',
        'Reinstall battery drivers in Device Manager under "Batteries > Microsoft ACPI-Compliant Control Method Battery".'
      ]
    },
    {
      keywords: ['blue screen', 'bsod', 'crash', 'freezing', 'slow', 'hanging', 'rebooting'],
      cause: 'Failing SSD / hard drive bad sectors, corrupted device drivers, or faulty RAM module',
      secondaryCauses: ['System file corruption', 'Thermal shutdown crash', 'Overheating GPU solder joint'],
      baseConfidence: 83,
      confidenceExplanation: 'Strong confidence — random freezes and blue screen stop codes point to volatile memory (RAM) or secondary storage read faults.',
      priceMin: 600,
      priceMax: 3500,
      recommendation: 'DIY Troubleshooting First',
      recommendationReason: 'Software integrity scans and memory diagnostics can be run independently before purchasing replacement hardware.',
      redFlags: [
        'Paying a technician for "OS reinstall" when the underlying cause is an SSD with bad sectors that will fail again in days.',
        'Ensure you back up personal documents immediately while the device is temporarily booted.'
      ],
      nextSteps: [
        'Note down the BSOD Stop Code (e.g., MEMORY_MANAGEMENT, CRITICAL_PROCESS_DIED, KERNEL_DATA_INPAGE_ERROR).',
        'Run Windows Memory Diagnostic tool (type mdsched.exe in Windows search) to test RAM sticks.',
        'Check SSD health using CrystalDiskInfo to view drive SMART health status.'
      ]
    }
  ],

  'Car': [
    {
      keywords: ['will not start', 'wont start', 'engine not starting', 'clicking', 'cranking slow', 'dead car', 'not starting', 'jump start'],
      cause: 'Discharged or dead 12V lead-acid battery, corroded terminal clamps, or failed starter motor solenoid',
      secondaryCauses: ['Failed alternator not recharging battery during driving', 'Blown ignition fuse or relay', 'Defective clutch/brake pedal interlock switch'],
      baseConfidence: 88,
      confidenceExplanation: 'High confidence — rapid clicking or total electrical silence on turning key / pressing start button is characteristic of insufficient 12V cold cranking amps (CCA).',
      priceMin: 500,
      priceMax: 5500,
      recommendation: 'DIY Check First',
      recommendationReason: 'Jump-starting or cleaning white terminal corrosion can be done easily; replacement battery is straightforward.',
      redFlags: [
        'Mechanics claiming complete engine seizure or ECU failure for a simple drained battery.',
        'Never jump start backwards (red to negative); reverse polarity blows main fusible links and onboard ECUs.'
      ],
      nextSteps: [
        'Turn on headlights and cabin light: if they are very dim or go completely black when turning key, battery voltage is low.',
        'Listen when turning ignition key: rapid clicking indicates a weak battery; a single solid clunk indicates a stuck starter solenoid.',
        'Inspect battery terminals under hood for white/green powder; clean with warm water and baking soda.'
      ]
    },
    {
      keywords: ['overheat', 'overheating', 'temperature high', 'steam', 'coolant', 'radiator', 'smoke from engine'],
      cause: 'Coolant leak, stuck closed thermostat valve, radiator cooling fan failure, or water pump impeller failure',
      secondaryCauses: ['Radiator cap pressure seal leak', 'Blown cylinder head gasket', 'Clogged radiator matrix fins'],
      baseConfidence: 87,
      confidenceExplanation: 'High confidence — engine overheating is an urgent cooling circuit failure requiring immediate shutdown to prevent head gasket warping.',
      priceMin: 800,
      priceMax: 6500,
      recommendation: 'Professional Repair',
      recommendationReason: 'Engine cooling system pressure testing and water pump replacement require professional automotive service.',
      redFlags: [
        'CRITICAL SAFETY WARNING: NEVER open the radiator cap or coolant expansion tank while the engine is hot; pressurized boiling coolant causes severe burns.',
        'Continuing to drive an overheating car will warp the cylinder head and cause catastrophic engine failure costing ₹40,000+.'
      ],
      nextSteps: [
        'Pull over safely to the side of the road and turn off engine immediately. Pop hood to let air circulate.',
        'Look beneath the car for puddles of bright green, pink, or orange coolant fluid.',
        'Once engine is fully cold (30+ minutes), check coolant level in the translucent plastic expansion reservoir.'
      ]
    },
    {
      keywords: ['brake', 'grinding', 'squealing', 'spongy', 'brake pedal', 'stopping distance', 'brake noise'],
      cause: 'Worn brake pad friction material reaching metal wear indicators, or grooved brake discs/rotors',
      secondaryCauses: ['Air in hydraulic brake lines', 'Sticking brake caliper guide pins', 'Contaminated brake pads with grease'],
      baseConfidence: 90,
      confidenceExplanation: 'High certainty — high-pitched squealing under light braking or metal-on-metal grinding directly indicates pad wear depth.',
      priceMin: 1200,
      priceMax: 4800,
      recommendation: 'Hire a Pro',
      recommendationReason: 'Braking is a critical vehicle safety system; improper pad fitting or bleed errors endanger lives.',
      redFlags: [
        'Never ignore metal-to-metal grinding; delaying repairs ruins the brake rotor discs, doubling the repair bill.',
        'Ensure the workshop uses OEM or reputed brake pads (e.g., Bosch, Brembo, TVS Girling).'
      ],
      nextSteps: [
        'Visually inspect the outer brake pad through wheel spoke slots: if friction pad thickness is under 3mm, replacement is urgent.',
        'Feel if the brake pedal sinks smoothly to the floor with little resistance (indicates brake fluid leak or air in lines).',
        'Check brake fluid reservoir under hood: low fluid indicates either pad wear or fluid loss.'
      ]
    }
  ],

  'Bike': [
    {
      keywords: ['will not start', 'wont start', 'starting trouble', 'kick start', 'self start not working', 'not starting', 'dead bike'],
      cause: 'Discharged battery (for self-start), fouled/carbon-choked spark plug, or clogged carburetor pilot jet',
      secondaryCauses: ['Faulty starter relay', 'Stale fuel or water in fuel tank', 'Kill switch accidentally toggled or faulty side-stand sensor'],
      baseConfidence: 86,
      confidenceExplanation: 'High confidence — 2-wheelers failing to start usually lack ignition spark (plug/battery) or fuel delivery (jet clog).',
      priceMin: 350,
      priceMax: 2800,
      recommendation: 'DIY Troubleshooting First',
      recommendationReason: 'Checking the engine kill switch, choke lever, and cleaning the spark plug can be done with the bike toolkit.',
      redFlags: [
        'Mechanics advising an engine overhaul or bore replacement for simple ignition/carburetor issues.',
        'Ensure fuel petcock valve is in "ON" or "RESERVE" position before paying for roadside inspection.'
      ],
      nextSteps: [
        'Check the handlebar engine kill switch (red rocker switch) and ensure side stand is up.',
        'Remove spark plug using the onboard toolkit plug spanner; wipe black carbon soot with sand paper and check gap.',
        'Turn ignition key on and check if horn sounds loud and crisp; a weak horn confirms a dead battery.'
      ]
    },
    {
      keywords: ['mileage', 'poor mileage', 'fuel economy', 'smoke', 'jerking', 'missing', 'bogging down'],
      cause: 'Rich carburetor mixture, dirty air filter foam element, or worn clutch plates slipping under throttle',
      secondaryCauses: ['Tappet / valve clearance out of spec', 'Under-inflated tires', 'Partially jammed drum/disc brake shoe'],
      baseConfidence: 83,
      confidenceExplanation: 'High confidence — drop in mileage accompanied by jerking is classic for air restriction or fuel-air mixture imbalance.',
      priceMin: 400,
      priceMax: 2200,
      recommendation: 'Hire a Pro',
      recommendationReason: 'Tuning fuel-air mixture screw and valve clearance adjustment requires mechanic experience.',
      redFlags: [
        'Unnecessary engine decarb packages pushed by service centers without inspecting simple air filter cleanliness.',
        'Clutch slipping warning: if engine revs loudly on throttle but bike gains speed slowly, clutch plates are worn.'
      ],
      nextSteps: [
        'Open side panel and inspect the air filter; if black and choked with dust, replace or wash in solvent.',
        'Inspect spark plug tip color: light tan/brown indicates healthy mixture; matte black indicates too much fuel (running rich).',
        'Check tire pressure at a petrol pump; low tire pressure alone reduces bike fuel efficiency by 15-20%.'
      ]
    }
  ],

  'AC': [
    {
      keywords: ['not cooling', 'warm air', 'cooling low', 'no cooling', 'blows warm', 'compressor not working'],
      cause: 'Refrigerant gas leak in copper tubing, failed dual run capacitor on outdoor unit, or choked indoor air filter',
      secondaryCauses: ['Dust clogged outdoor condenser coil', 'Thermostat sensor calibrated incorrectly', 'PCB compressor relay failure'],
      baseConfidence: 84,
      confidenceExplanation: 'Strong confidence — warm air discharge is typically caused by failure of the outdoor condenser unit to engage (capacitor) or low gas pressure from a micro-leak.',
      priceMin: 1200,
      priceMax: 4200,
      recommendation: 'Hire a Pro',
      recommendationReason: 'High voltage capacitor discharge risk and EPA/gas brazing requirements mandate a certified AC technician.',
      redFlags: [
        'Technicians doing a gas refill without doing nitrogen pressure leak testing first — the new gas will leak out again in weeks.',
        'Claiming the entire PCB board or compressor is dead when only a ₹450 outdoor dual capacitor is swollen.'
      ],
      nextSteps: [
        'Clean the slide-out mesh air filters behind the indoor unit front flap; choked filters block air volume completely.',
        'Listen to the outdoor unit: is the fan spinning and does the compressor hum, or is it completely silent?',
        'Look at the small copper pipes on the outdoor unit: if covered in white frost/ice, gas level is low due to a leak.'
      ]
    },
    {
      keywords: ['water dripping', 'leak', 'water leaking', 'dripping inside', 'water overflow'],
      cause: 'Clogged condensate drain hose (algae/fungus slime buildup) or unlevel indoor unit mounting',
      secondaryCauses: ['Cracked internal condensate drain tray', 'Frozen cooling coil thawing rapidly', 'Disconnected drain pipe joint inside wall'],
      baseConfidence: 91,
      confidenceExplanation: 'High certainty — indoor water dripping is virtually always caused by a blocked condensate drain line.',
      priceMin: 350,
      priceMax: 1200,
      recommendation: 'DIY Troubleshooting',
      recommendationReason: 'Blowing compressed air or flushing warm water through the drain pipe easily clears slime blocks.',
      redFlags: [
        'Do not pay thousands for "coil servicing" if the problem is simply a clogged plastic drain tube.',
        'Turn AC off while dripping to prevent water entry into the indoor electronic display PCB.'
      ],
      nextSteps: [
        'Inspect the outdoor end of the drain pipe: if no water drips out during cooling, the line is clogged inside.',
        'Gently blow into or vacuum the outer drain pipe tip to dislodge the accumulated jelly-like algae clog.',
        'Ensure the indoor unit has a very slight downward tilt toward the drain pipe exit side.'
      ]
    }
  ],

  'TV': [
    {
      keywords: ['black screen', 'no picture', 'sound but no picture', 'sound works', 'dark screen', 'backlight'],
      cause: 'Burned out LED backlight strips behind the LCD display panel',
      secondaryCauses: ['Backlight LED driver inverter circuit failure on power supply board', 'Faulty T-Con (timing controller) board', 'Loose panel ribbon cable'],
      baseConfidence: 92,
      confidenceExplanation: 'High confidence — hearing sound and dialogue while the picture is completely black is the textbook hallmark of LED backlight failure.',
      priceMin: 1500,
      priceMax: 4500,
      recommendation: 'Hire a Pro',
      recommendationReason: 'Replacing backlight strips requires fully peeling off the fragile glass LCD panel without cracking it.',
      redFlags: [
        'Shops claiming you need a complete display panel replacement (often ₹12,000+) when backlight strips cost only ₹1,500–₹3,500.',
        'Ask the technician to replace all LED strips together rather than patching just one faulty LED diode.'
      ],
      nextSteps: [
        'Perform the flashlight test: turn the TV on in a dark room with sound playing, and shine a torch at a 45° angle 2 inches from the glass. If you can see faint picture silhouettes, backlights are blown.',
        'Check if the TV menu or volume overlay appears on screen.',
        'Disconnect all external HDMI devices and observe if the TV logo flashes momentarily on boot.'
      ]
    },
    {
      keywords: ['lines', 'vertical lines', 'horizontal lines', 'distorted', 'screen lines', 'flicker'],
      cause: 'Faulty T-Con board, loose LVDS ribbon cables, or delaminated COF (Chip-on-Film) bonding tabs',
      secondaryCauses: ['Physical panel pressure crack', 'Internal glass substrate liquid damage', 'Graphics processing engine defect on mainboard'],
      baseConfidence: 82,
      confidenceExplanation: 'Strong confidence — organized colored lines across the screen indicate communication failures between the timing controller and display driver ICs.',
      priceMin: 1200,
      priceMax: 5500,
      recommendation: 'Hire a Pro',
      recommendationReason: 'T-Con board replacement or COF bonding requires specialized tab-bonding equipment.',
      redFlags: [
        'Check if lines appeared after cleaning the TV with spray cleaner; liquid dripping into the bottom bezel causes irreversible COF corrosion.',
        'If the internal glass matrix is physically cracked, repair is uneconomical.'
      ],
      nextSteps: [
        'Gently press the bottom bezel near the lines to see if they flicker or change color (points to loose tab bonding).',
        'Test on multiple inputs (HDMI, YouTube, USB) to ensure the lines are not originating from a set-top box or cable.',
        'Unplug the TV from mains power for 15 minutes to allow all residual processor cache to reset.'
      ]
    }
  ],

  'Fan': [
    {
      keywords: ['slow', 'rotating slow', 'speed low', 'humming', 'wont spin', 'slow speed'],
      cause: 'Degraded ceiling fan motor run capacitor (weak microfarad rating)',
      secondaryCauses: ['Dry or jammed ball bearings / bronze bushes', 'Internal stator winding insulation breakdown', 'Defective wall fan speed regulator'],
      baseConfidence: 93,
      confidenceExplanation: 'High certainty — ceiling fans running slow or needing a manual push to start are overwhelmingly caused by a degraded start/run capacitor.',
      priceMin: 150,
      priceMax: 600,
      recommendation: 'DIY Troubleshooting',
      recommendationReason: 'Capacitor replacement costs ₹40–₹80 for the part and takes 10 minutes with basic screwdriver and pliers.',
      redFlags: [
        'Do not pay more than ₹300–₹500 for fan speed issues; replacing the capacitor almost always fixes it.',
        'Always turn off the wall switch and main MCB before touching fan wiring.'
      ],
      nextSteps: [
        'Try pushing the fan blade with a ruler while switched on: if it starts spinning, the capacitor is 100% at fault.',
        'Spin the blades by hand while off: if it feels stiff and stops abruptly, bearings need lubrication or replacement.',
        'Bypass the wall regulator temporarily to verify the regulator is not dropping voltage.'
      ]
    },
    {
      keywords: ['noise', 'squeaking', 'wobbling', 'rattling', 'shaking', 'vibration'],
      cause: 'Worn motor ball bearings needing replacement or unbalanced fan blades',
      secondaryCauses: ['Loose downrod shackle bolt / ceiling hook', 'Blade mounting screws vibrating loose', 'Bent blade bracket angle'],
      baseConfidence: 88,
      confidenceExplanation: 'Strong confidence — grinding noise comes from dry bearing races; wobbling stems from blade weight imbalance.',
      priceMin: 200,
      priceMax: 700,
      recommendation: 'DIY Inspection First',
      recommendationReason: 'Tightening canopy and blade screws is an easy DIY fix; bearing replacement requires puller tools.',
      redFlags: [
        'Never ignore severe wobbling: check the safety wire and cotter pin on the downrod to prevent the fan from falling.',
        'Ensure power is off before reaching up to inspect blades.'
      ],
      nextSteps: [
        'Tighten all blade mounting screws and check that all blade tips measure the exact same vertical distance from the ceiling.',
        'Check that the cotter pin through the ceiling hook bolt is intact.',
        'Spin slowly by hand: a rough gritty grating sound confirms dry bearings.'
      ]
    }
  ],

  'Microwave': [
    {
      keywords: ['not heating', 'not hot', 'turns on but cold', 'no heat', 'food cold', 'runs but not heating'],
      cause: 'Blown high-voltage diode, blown high-voltage fuse, or burned magnetron tube filament',
      secondaryCauses: ['Faulty door safety interlock switch assembly', 'High voltage capacitor short', 'PCB power relay failure'],
      baseConfidence: 89,
      confidenceExplanation: 'High confidence — if the turntable spins and light turns on but food remains cold, the high voltage microwave generation circuit is interrupted.',
      priceMin: 600,
      priceMax: 2600,
      recommendation: 'Hire a Pro',
      recommendationReason: 'LETHAL VOLTAGE WARNING: Microwave high-voltage capacitors store up to 4,000 Volts even when unplugged. Professional repair only.',
      redFlags: [
        'DANGER: NEVER open the outer cover of a microwave oven without proper high-voltage capacitor discharge equipment.',
        'Technicians charging for a new magnetron when only a ₹150 high-voltage fuse or diode is blown.'
      ],
      nextSteps: [
        'Ensure you are testing with a cup of water, as microwaves should never be operated empty.',
        'Listen for the deep hum that typically accompanies heating: if absent, the high-voltage transformer is not engaging.',
        'Check whether the door latches with a crisp click on both upper and lower hooks.'
      ]
    },
    {
      keywords: ['sparking', 'sparks', 'burning smell', 'smoke', 'arc', 'arcing'],
      cause: 'Burnt or carbonized mica waveguide cover plate or exposed metal interior cavity',
      secondaryCauses: ['Food splatter caught on waveguide cover', 'Damaged turntable roller ring with metal contact', 'Burned magnetron antenna dome'],
      baseConfidence: 91,
      confidenceExplanation: 'Very high confidence — sparking inside the cooking cavity is almost always caused by food grease baked into the mica waveguide cover plate.',
      priceMin: 300,
      priceMax: 1200,
      recommendation: 'DIY Troubleshooting First',
      recommendationReason: 'Replacing a burnt cardboard-like mica sheet plate costs under ₹200 and takes 5 minutes.',
      redFlags: [
        'Stop using immediately when sparking occurs to prevent burning a hole through the magnetron antenna.',
        'Do not place gold/silver trimmed ceramics, aluminum foil, or twist ties inside the oven.'
      ],
      nextSteps: [
        'Look at the small rectangular plate on the right inside wall (mica sheet): if it has black carbon burns, it must be replaced.',
        'Thoroughly clean all grease and dried food splatter from inside the cavity walls and ceiling.',
        'Order an inexpensive universal mica sheet online, cut to size with scissors, and slot into place.'
      ]
    }
  ]
}

// Generic fallback rules for any device type or unlisted symptom
const GENERIC_DIAGNOSTIC_CATEGORIES = [
  {
    category: 'Power & Electrical',
    keywords: ['power', 'wont turn on', 'dead', 'start', 'tripping', 'switch', 'fuse', 'cord', 'breaker', 'shock'],
    cause: 'Mains power supply disruption, internal safety fuse rupture, or control board voltage regulator failure',
    priceMin: 400,
    priceMax: 2500,
    recommendation: 'Hire a Pro',
    recommendationReason: 'Requires safe multimeter testing to isolate 230V mains voltage and ground leakage.',
    redFlags: ['Ensure the device is completely disconnected from power before opening any covers.', 'Check if wall socket has melted pins or carbon buildup.']
  },
  {
    category: 'Fluid & Leakage',
    keywords: ['leak', 'water', 'oil', 'fluid', 'dripping', 'drain', 'puddle', 'spill', 'pipe', 'hose'],
    cause: 'Seal degradation, loose hose clamp connection, or pump casing fracture',
    priceMin: 500,
    priceMax: 2200,
    recommendation: 'DIY Inspection First',
    recommendationReason: 'Clamps and external line connections can often be tightened or cleared of blockages directly.',
    redFlags: ['Risk of electrical short-circuit if fluid contacts internal wiring.', 'Avoid using adhesive tape as a permanent fix for pressurized water or fuel lines.']
  },
  {
    category: 'Thermal & Cooling',
    keywords: ['overheat', 'hot', 'warm', 'cooling', 'fan', 'temperature', 'heat', 'thermal', 'smoke', 'steam'],
    cause: 'Cooling airflow restriction, dust clogging, degraded thermal interface, or cooling fan failure',
    priceMin: 600,
    priceMax: 3000,
    recommendation: 'Hire a Pro',
    recommendationReason: 'Prolonged overheating can permanently degrade silicon processors and motor coil insulation.',
    redFlags: ['Stop operating immediately if burning smell or smoke is detected.', 'Ensure intake and exhaust vents have at least 10 cm of clear airflow clearance.']
  },
  {
    category: 'Mechanical & Noise',
    keywords: ['noise', 'banging', 'grinding', 'squeaking', 'rattle', 'vibrat', 'shaking', 'loose', 'jammed', 'stuck'],
    cause: 'Bearing wear, component misalignment, loose fasteners, or foreign obstruction in rotating assembly',
    priceMin: 500,
    priceMax: 3500,
    recommendation: 'Hire a Pro',
    recommendationReason: 'Rotational components require proper alignment and torque to prevent catastrophic mechanical failure.',
    redFlags: ['Continuing operation with severe mechanical grinding can damage structural shafts and housings beyond repair.']
  },
  {
    category: 'Display & Glass',
    keywords: ['screen', 'display', 'glass', 'cracked', 'broken', 'lines', 'flicker', 'touch', 'black screen'],
    cause: 'Physical display substrate fracture, damaged flex cable ribbon, or panel driver circuit failure',
    priceMin: 1500,
    priceMax: 7000,
    recommendation: 'Professional Repair',
    recommendationReason: 'Display assemblies are delicate and require specialized separation adhesives and clean workspace.',
    redFlags: ['Be cautious of cheap generic replacement screens that degrade battery life and display calibration.']
  }
]

// Recognized symptoms, appliance components, and failure verbs
const REPAIR_KEYWORDS = [
  // Actions & States
  'start', 'turn', 'work', 'run', 'spin', 'cool', 'freeze', 'heat', 'charge', 'leak',
  'drip', 'drop', 'fall', 'break', 'broke', 'broken', 'crack', 'shatter', 'click', 'buzz',
  'hum', 'smoke', 'smell', 'burn', 'burnt', 'stop', 'fail', 'shut', 'die', 'drain',
  'fill', 'flush', 'clog', 'block', 'jam', 'flicker', 'hang', 'stuck', 'slow', 'slip',
  'squeak', 'grind', 'vibrate', 'shake', 'wobble', 'trip', 'overheat', 'hot', 'warm',
  'cold', 'dead', 'loose', 'loud', 'noise', 'sound', 'damage', 'fault', 'error', 'issue',
  'problem', 'trouble', 'cut', 'spark', 'sparks', 'shock', 'unresponsive', 'glitch', 'stall',
  'jerk', 'spill', 'wet', 'water', 'oil', 'fluid', 'gas', 'air', 'power', 'battery',
  'speed', 'whine', 'thump', 'rattle', 'screech', 'roaring', 'chirp', 'reboot', 'restart',

  // Common problem descriptors & negations
  'not', 'no', 'wont', "won't", "doesn't", 'doesnt', 'cannot', "can't", 'cant', 'unable',
  'hard', 'poor', 'bad', 'low', 'high', 'off', 'sudden', 'blank', 'black', 'dark', 'dim',

  // Hardware parts & components
  'screen', 'display', 'glass', 'touch', 'port', 'cable', 'wire', 'cord', 'plug', 'charger',
  'motor', 'pump', 'fan', 'compressor', 'coil', 'condenser', 'evaporator', 'filter', 'gasket',
  'seal', 'door', 'lid', 'switch', 'button', 'key', 'board', 'pcb', 'fuse', 'mcb',
  'breaker', 'bearing', 'spider', 'drum', 'tub', 'belt', 'hose', 'pipe', 'valve', 'brake',
  'pad', 'rotor', 'disc', 'chain', 'sprocket', 'clutch', 'gear', 'engine', 'radiator',
  'coolant', 'exhaust', 'carburetor', 'spark plug', 'horn', 'headlight', 'light', 'heatsink',
  'paste', 'ram', 'ssd', 'hdd', 'storage', 'speaker', 'mic', 'microphone', 'camera',
  'sensor', 'regulator', 'capacitor', 'magnetron', 'diode', 'tray', 'drawer', 'tcon',
  'backlight', 'led', 'lcd', 'oled', 'amoled', 'motherboard', 'sim', 'head', 'cylinder'
]

// Recognized common brand names and model descriptors
const COMMON_DEVICE_TERMS = [
  'samsung', 'apple', 'iphone', 'ipad', 'macbook', 'dell', 'hp', 'lenovo', 'asus', 'acer',
  'sony', 'lg', 'whirlpool', 'bosch', 'ifb', 'haier', 'panasonic', 'godrej', 'voltas',
  'daikin', 'blue star', 'hitachi', 'carrier', 'lloyd', 'mi', 'xiaomi', 'redmi', 'realme',
  'oppo', 'vivo', 'oneplus', 'motorola', 'moto', 'nokia', 'google', 'pixel', 'boat',
  'bajaj', 'crompton', 'havells', 'usha', 'orient', 'atomberg', 'hero', 'honda', 'tvs',
  'yamaha', 'suzuki', 'royal enfield', 'ktm', 'maruti', 'hyundai', 'tata',
  'mahindra', 'toyota', 'kia', 'volkswagen', 'skoda', 'ford'
]

/**
 * Validates problem description to ensure it contains recognizable symptoms
 * and is not random gibberish (e.g. 'chgcc', 'asdfgh', '12345').
 */
export function validateProblemText(problem, device = 'device', brand = '', model = '') {
  const clean = (problem || '').trim().toLowerCase()
  const deviceName = `${brand ? brand + ' ' : ''}${model ? model + ' ' : ''}${device}`.trim()
  
  if (!clean || clean.length < 3) {
    return {
      isValid: false,
      error: 'Please enter a description of the problem with at least 3 characters.'
    }
  }

  // 1. Check if input contains solely numbers or punctuation
  if (/^[^a-z]+$/i.test(clean)) {
    return {
      isValid: false,
      error: `Please describe what is happening with your ${deviceName} in words (e.g. 'not starting', 'making noise', 'battery draining').`
    }
  }

  // 2. Check for single character repetition: 'aaaaa', 'zzzzz'
  if (/^(.)\1{2,}$/.test(clean)) {
    return {
      isValid: false,
      error: `Could not identify any symptoms from "${problem}". Please describe the issue with your ${deviceName} (e.g. 'not charging', 'water leaking').`
    }
  }

  // 3. Check for keyboard mash patterns: 'asdf', 'qwerty', etc.
  const mashPatterns = ['asdf', 'sdfg', 'dfgh', 'fghj', 'ghjk', 'hjkl', 'qwerty', 'werty', 'zxcv', 'xcvb', 'cvbn']
  for (const p of mashPatterns) {
    if (clean.includes(p) && clean.length <= p.length + 3) {
      return {
        isValid: false,
        error: `Could not recognize any valid repair symptoms from "${problem}". Please describe what is wrong with your ${deviceName}.`
      }
    }
  }

  // 4. Tokenize and check for random consonants / lack of vowels (e.g. 'chgcc')
  const words = clean.split(/[\s,.;:!?/\-_+]+/).filter(Boolean)
  let recognizedTermsCount = 0
  let suspiciousWordsCount = 0

  for (const w of words) {
    // Check if this word matches any repair vocabulary
    const isRepairTerm = REPAIR_KEYWORDS.some(k => k.includes(' ') ? clean.includes(k) : (w === k || w.startsWith(k) || (k.startsWith(w) && w.length >= 4)))
    const isDeviceTerm = COMMON_DEVICE_TERMS.some(b => w === b || clean.includes(b))

    if (isRepairTerm || isDeviceTerm) {
      recognizedTermsCount++
      continue
    }

    // Check if word has 4+ characters with 0 vowels (like 'chgcc')
    const vowels = (w.match(/[aeiouy]/gi) || []).length
    if (w.length >= 4 && vowels === 0) {
      suspiciousWordsCount++
    }
    // 5+ consecutive consonants
    if (/[bcdfghjklmnpqrstvwxz]{5,}/i.test(w)) {
      suspiciousWordsCount++
    }
    // Quadruple repeated letters (e.g. 'zzzz', 'xxxx')
    if (/(.)\1{3,}/.test(w)) {
      suspiciousWordsCount++
    }
  }

  // If suspicious words dominate and NO repair terms are present
  if (suspiciousWordsCount > 0 && recognizedTermsCount === 0) {
    return {
      isValid: false,
      error: `Could not recognize any clear symptoms from "${problem}". Please describe what is happening with your ${deviceName} (e.g. 'screen is cracked', 'water leaking', 'not charging', 'making loud noise').`
    }
  }

  // If no recognized repair terms or keywords in input
  const hasAnyKeyword = REPAIR_KEYWORDS.some(k => clean.includes(k))
  if (!hasAnyKeyword && words.length <= 3) {
    // For very short phrases without any recognized repair word (e.g. 'chgcc', 'pencil table', 'random test')
    return {
      isValid: false,
      error: `Could not recognize any repair symptoms from "${problem}". Please describe what is wrong with your ${deviceName} (e.g. 'not working', 'won\'t turn on', 'broken screen', 'leaking water').`
    }
  }

  return { isValid: true }
}

/**
 * Perform rule-based domain diagnosis
 */
export function diagnoseLocally({ device, problem, brand = '', model = '', age = null }) {
  const normProblem = (problem || '').toLowerCase().trim()
  const normDevice = device || 'Phone'
  
  // Validate problem input for meaningful symptoms and reject gibberish/random characters
  const validation = validateProblemText(problem, normDevice, brand, model)
  if (!validation.isValid) {
    throw new Error(validation.error)
  }

  // 1. Search device-specific rules
  const deviceRules = DEVICE_DIAGNOSTIC_RULES[normDevice] || []
  let bestMatch = null
  let maxMatchedKeywords = 0

  for (const rule of deviceRules) {
    let matches = 0
    for (const kw of rule.keywords) {
      if (normProblem.includes(kw)) {
        matches += kw.split(' ').length // weight multi-word matches higher
      }
    }
    if (matches > maxMatchedKeywords) {
      maxMatchedKeywords = matches
      bestMatch = rule
    }
  }

  // 2. If matched a device-specific rule
  if (bestMatch && maxMatchedKeywords > 0) {
    // Dynamic confidence score calculation based on specificity and detail length
    let confidence = bestMatch.baseConfidence
    
    // Bonus for longer, descriptive input
    if (normProblem.length > 50) confidence += 3
    if (normProblem.length > 100) confidence += 2
    
    // Bonus if brand or model provided
    if (brand && brand.trim()) confidence += 2
    if (model && model.trim()) confidence += 2
    
    // Uncertainty penalty for very brief inputs (< 15 chars)
    if (normProblem.length < 15) {
      confidence -= 12
    } else if (normProblem.length < 25) {
      confidence -= 6
    }
    
    confidence = Math.min(94, Math.max(52, confidence))

    // Dynamic price adjustment based on age / brand
    let priceMin = bestMatch.priceMin
    let priceMax = bestMatch.priceMax
    
    const isPremiumBrand = /(apple|iphone|macbook|sony|dell xps|samsung galaxy s|bose|bosch)/i.test(`${brand} ${model} ${normProblem}`)
    if (isPremiumBrand) {
      priceMin = Math.round(priceMin * 1.35 / 50) * 50
      priceMax = Math.round(priceMax * 1.45 / 50) * 50
    }

    // Recommendation override if device is very old and repair cost is high
    let recommendation = bestMatch.recommendation
    let recommendationReason = bestMatch.recommendationReason
    if (age && Number(age) >= 8 && priceMax > 3500) {
      recommendation = 'Consider Replacement'
      recommendationReason = `Given that this ${normDevice} is ~${age} years old and estimated repair is up to ₹${priceMax.toLocaleString()}, replacing with a modern energy-efficient unit is financially smarter.`
    }

    return {
      cause: bestMatch.cause,
      secondaryCauses: bestMatch.secondaryCauses || [],
      confidence,
      confidenceExplanation: bestMatch.confidenceExplanation,
      priceMin,
      priceMax,
      recommendation,
      recommendationReason,
      redFlags: bestMatch.redFlags || [],
      nextSteps: bestMatch.nextSteps || [
        'Inspect the device visually for physical damage or loose external cables.',
        'Test power outlet and safety switches before dismantling.',
        'Obtain a quote from at least two local repair shops to prevent overcharging.'
      ]
    }
  }

  // 3. Fallback: match generic categories
  for (const cat of GENERIC_DIAGNOSTIC_CATEGORIES) {
    for (const kw of cat.keywords) {
      if (normProblem.includes(kw)) {
        const confidence = normProblem.length > 40 ? 68 : 55
        return {
          cause: `${cat.cause} on ${normDevice}`,
          secondaryCauses: [`Intermittent connection or circuit board fault on ${normDevice}`, 'Component aging and thermal stress'],
          confidence,
          confidenceExplanation: `Moderate confidence (${confidence}%) — symptoms point toward a ${cat.category.toLowerCase()} issue, but further physical testing is needed to confirm the exact failing part.`,
          priceMin: cat.priceMin,
          priceMax: cat.priceMax,
          recommendation: cat.recommendation,
          recommendationReason: cat.recommendationReason,
          redFlags: cat.redFlags,
          nextSteps: [
            `Disconnect ${normDevice} from mains power safely before physical inspection.`,
            'Check for visible wire wear, odd smells, or loose mechanical fastenings.',
            'Note any error messages, unusual sounds, or indicator light blinks to tell the technician.'
          ]
        }
      }
    }
  }

  // 4. Broad generic diagnostic when input has low specificity
  return {
    cause: `Internal hardware fault or component degradation in ${normDevice}`,
    secondaryCauses: ['Power regulation or safety switch failure', 'Operational wear and tear on primary subsystem'],
    confidence: 48,
    confidenceExplanation: 'Fair/Low confidence (48%) — the problem description provided is broad. Provide more specific symptoms (e.g. noises, leaks, error codes, lights) to refine this diagnosis.',
    priceMin: 600,
    priceMax: 3000,
    recommendation: 'Hire a Pro',
    recommendationReason: 'An in-person diagnostic with test tools is advised to accurately identify the root cause.',
    redFlags: [
      'Always request an itemized diagnostic quote before authorizing component replacements.',
      'Never attempt internal repairs on high-voltage electrical appliances without proper training.'
    ],
    nextSteps: [
      'Verify if the issue happens every time or only under specific usage cycles.',
      'Test wall socket with another appliance to ensure clean electrical supply.',
      'Check if the product is still covered under manufacturer or retailer warranty.'
    ]
  }
}

/**
 * Validate an AI-generated diagnosis response
 */
export function validateDiagnosisResponse(data) {
  if (!data || typeof data !== 'object') return false
  if (!data.cause || typeof data.cause !== 'string' || data.cause.trim().length < 5) return false
  if (typeof data.confidence !== 'number' || isNaN(data.confidence) || data.confidence < 10 || data.confidence > 100) return false
  if (typeof data.priceMin !== 'number' || typeof data.priceMax !== 'number' || data.priceMin <= 0 || data.priceMax < data.priceMin) return false
  if (!data.recommendation || typeof data.recommendation !== 'string') return false
  if (!Array.isArray(data.redFlags) || data.redFlags.length === 0) return false
  if (!Array.isArray(data.nextSteps) || data.nextSteps.length === 0) return false
  return true
}

/**
 * Request AI diagnosis with automatic fallback to local engine
 */
export async function getDiagnosis({ device, problem, brand = '', model = '', age = null }) {
  // Validate problem input for meaningful symptoms and reject gibberish/random characters
  const validation = validateProblemText(problem, device, brand, model)
  if (!validation.isValid) {
    throw new Error(validation.error)
  }

  // 1. If backend API endpoint is available (e.g. in Vercel or local server)
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 6000)

    const response = await fetch('/api/diagnose', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ device, problem, brand, model, age }),
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    if (response.ok) {
      const data = await response.json()
      if (validateDiagnosisResponse(data)) {
        return data
      }
    }
  } catch {
    // API endpoint not configured or timed out, gracefully continue to local diagnostic engine
  }

  // 2. Client-side local intelligent diagnosis engine
  // Add a small natural delay (400ms) for realistic UX processing
  await new Promise(r => setTimeout(r, 450))
  return diagnoseLocally({ device, problem, brand, model, age })
}
