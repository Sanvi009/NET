document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const speedValue = document.getElementById('speedValue');
    const progressBar = document.getElementById('progressBar');
    const testButton = document.getElementById('testButton');
    const detailsToggle = document.getElementById('detailsToggle');
    const detailsPanel = document.getElementById('detailsPanel');
    const statusText = document.getElementById('statusText');
    const connectionStatus = document.getElementById('connectionStatus');

    // Network info elements
    const pingValue = document.getElementById('pingValue');
    const jitterValue = document.getElementById('jitterValue');
    const packetLossValue = document.getElementById('packetLossValue');

    // Detailed stats elements
    const downloadValue = document.getElementById('downloadValue');
    const uploadValue = document.getElementById('uploadValue');
    const pingDetailValue = document.getElementById('pingDetailValue');
    const jitterDetailValue = document.getElementById('jitterDetailValue');
    const serverValue = document.getElementById('serverValue');
    const ipValue = document.getElementById('ipValue');
    const ispValue = document.getElementById('ispValue');
    const protocolValue = document.getElementById('protocolValue');

    // Quality indicators
    const downloadQuality = document.getElementById('downloadQuality');
    const uploadQuality = document.getElementById('uploadQuality');
    const stabilityQuality = document.getElementById('stabilityQuality');

    // Test options
    const optionBasic = document.getElementById('optionBasic');
    const optionDetailed = document.getElementById('optionDetailed');
    const optionAdvanced = document.getElementById('optionAdvanced');

    // Test state
    let testInProgress = false;
    let testMode = 'basic'; // 'basic', 'detailed', 'advanced'

    // Server locations
    const servers = [
        'New York, USA',
        'London, UK',
        'Tokyo, Japan',
        'Sydney, Australia',
        'Frankfurt, Germany',
        'Singapore',
    ];

    // ISPs
    const isps = [
        'Comcast Business',
        'AT&T Enterprise',
        'Verizon Business',
        'Spectrum Enterprise',
        'Google Fiber Business',
    ];

    // Protocols
    const protocols = ['HTTPS', 'HTTP/2', 'HTTP/3', 'QUIC'];

    // Initialize
    resetUI();
    generateFakeIP();
    getISP();
    updateProtocol();

    // Event listeners
    testButton.addEventListener('click', startTest);
    detailsToggle.addEventListener('click', toggleDetails);

    // Test option event listeners
    optionBasic.addEventListener('click', () => setTestMode('basic'));
    optionDetailed.addEventListener('click', () => setTestMode('detailed'));
    optionAdvanced.addEventListener('click', () => setTestMode('advanced'));

    function setTestMode(mode) {
        testMode = mode;

        // Update UI to reflect active mode
        optionBasic.classList.remove('active');
        optionDetailed.classList.remove('active');
        optionAdvanced.classList.remove('active');

        if (mode === 'basic') optionBasic.classList.add('active');
        if (mode === 'detailed') optionDetailed.classList.add('active');
        if (mode === 'advanced') optionAdvanced.classList.add('active');

        statusText.textContent = `Ready for ${mode} analysis`;
    }

    function startTest() {
        if (testInProgress) return;

        testInProgress = true;
        resetUI();
        testButton.disabled = true;
        connectionStatus.classList.add('testing');
        testButton.innerHTML = '<div class="loading-dots"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div> Analyzing';
        statusText.textContent = "Testing ping...";

        // Simulate ping test first
        simulatePingTest().then(ping => {
            pingValue.textContent = ping;
            pingDetailValue.textContent = ping + ' ms';

            // Simulate jitter
            const jitter = Math.max(1, Math.floor(ping * 0.15 + Math.random() * 5));
            jitterValue.textContent = jitter;
            jitterDetailValue.textContent = jitter + ' ms';

            // Simulate packet loss (0% to 2% based on ping)
            const packetLoss = Math.min(2, (ping / 100) * Math.random()).toFixed(1);
            packetLossValue.textContent = `${packetLoss}%`;

            // Update stability quality based on ping and jitter
            const stability = Math.max(0, 100 - (ping / 2) - (jitter * 2));
            stabilityQuality.style.width = `${stability}%`;

            statusText.textContent = "Testing download speed...";

            // Then simulate download speed test
            simulateSpeedTest('download').then(downloadSpeed => {
                downloadValue.textContent = downloadSpeed + ' Mbps';
                speedValue.textContent = downloadSpeed;

                // Update download quality
                const dlQuality = Math.min(100, (downloadSpeed / 10));
                downloadQuality.style.width = `${dlQuality}%`;

                // For detailed and advanced modes, simulate upload test
                if (testMode !== 'basic') {
                    statusText.textContent = "Testing upload speed...";

                    // Simulate upload speed test
                    simulateSpeedTest('upload').then(uploadSpeed => {
                        uploadValue.textContent = uploadSpeed + ' Mbps';

                        // Update upload quality
                        const ulQuality = Math.min(100, (uploadSpeed / 5));
                        uploadQuality.style.width = `${ulQuality}%`;

                        finishTest();
                    });
                } else {
                    // For basic mode, skip upload test
                    uploadValue.textContent = "N/A";
                    finishTest();
                }
            });
        });

        function finishTest() {
            statusText.textContent = "Analysis complete";
            testButton.innerHTML = '<i class="fas fa-redo"></i> Test Again';
            testButton.disabled = false;
            connectionStatus.classList.remove('testing');
            testInProgress = false;

            // Random server location
            const randomServer = servers[Math.floor(Math.random() * servers.length)];
            serverValue.textContent = randomServer;
        }
    }

    function simulatePingTest() {
        return new Promise(resolve => {
            // Simulate network delay based on test mode
            const delay = testMode === 'advanced' ? 1000 : 1500;

            setTimeout(() => {
                // Simulate ping with different ranges based on mode
                let ping;
                if (testMode === 'advanced') {
                    ping = Math.floor(Math.random() * 30) + 5; // 5-35ms for advanced
                } else if (testMode === 'detailed') {
                    ping = Math.floor(Math.random() * 50) + 10; // 10-60ms for detailed
                } else {
                    ping = Math.floor(Math.random() * 70) + 15; // 15-85ms for basic
                }
                resolve(ping);
            }, delay);
        });
    }

    function simulateSpeedTest(type) {
        return new Promise(resolve => {
            // Different durations based on test mode and type
            let duration;
            if (testMode === 'advanced') {
                duration = type === 'download' ? 4000 : 3500;
            } else if (testMode === 'detailed') {
                duration = type === 'download' ? 3000 : 2500;
            } else {
                duration = 2500; // Basic mode only tests download
            }

            const interval = 50;
            const steps = duration / interval;
            let currentStep = 0;

            // Simulate different internet speeds based on mode and type
            let maxSpeed;
            if (type === 'download') {
                if (testMode === 'advanced') {
                    maxSpeed = Math.random() * 900 + 100; // 100-1000 Mbps
                } else if (testMode === 'detailed') {
                    maxSpeed = Math.random() * 700 + 50; // 50-750 Mbps
                } else {
                    maxSpeed = Math.random() * 500 + 30; // 30-530 Mbps for basic
                }
            } else {
                // Upload speeds are typically slower
                if (testMode === 'advanced') {
                    maxSpeed = Math.random() * 100 + 20; // 20-120 Mbps
                } else {
                    maxSpeed = Math.random() * 80 + 10; // 10-90 Mbps
                }
            }

            const testInterval = setInterval(() => {
                currentStep++;

                // Calculate progress percentage
                const progress = (currentStep / steps) * 100;
                progressBar.style.width = `${progress}%`;

                if (type === 'download') {
                    // Calculate current speed using easing function for realistic acceleration
                    const progressRatio = currentStep / steps;
                    const easedProgress = 1 - Math.pow(1 - progressRatio, 3);
                    const currentSpeed = Math.floor(easedProgress * maxSpeed);

                    // Add some fluctuations to simulate real network conditions
                    const fluctuation = maxSpeed * 0.1 * Math.sin(currentStep * 0.5);
                    const fluctuatedSpeed = Math.max(0, currentSpeed + fluctuation);

                    // Update speed display
                    speedValue.textContent = Math.floor(fluctuatedSpeed);

                    // Change color based on speed
                    updateSpeedColor(fluctuatedSpeed);
                }

                // End test
                if (currentStep >= steps) {
                    clearInterval(testInterval);
                    progressBar.style.width = '100%';

                    resolve(Math.floor(maxSpeed));
                }
            }, interval);
        });
    }

    function updateSpeedColor(speed) {
        if (speed < 20) {
            speedValue.style.color = '#EF4444';
        } else if (speed < 50) {
            speedValue.style.color = '#F59E0B';
        } else if (speed < 100) {
            speedValue.style.color = '#10B981';
        } else {
            speedValue.style.color = '#FFFFFF';
        }
    }

    function resetUI() {
        speedValue.textContent = '0';
        speedValue.style.color = '#FFFFFF';
        progressBar.style.width = '0%';
        downloadValue.textContent = '0 Mbps';
        uploadValue.textContent = '0 Mbps';
        pingValue.textContent = '0';
        pingDetailValue.textContent = '0 ms';
        jitterValue.textContent = '0';
        jitterDetailValue.textContent = '0 ms';
        packetLossValue.textContent = '0%';
        downloadQuality.style.width = '0%';
        uploadQuality.style.width = '0%';
        stabilityQuality.style.width = '0%';
    }

    function toggleDetails() {
        detailsPanel.classList.toggle('show');

        if (detailsPanel.classList.contains('show')) {
            detailsToggle.innerHTML = '<i class="fas fa-chevron-up"></i> Hide detailed report';
        } else {
            detailsToggle.innerHTML = '<i class="fas fa-chevron-down"></i> Detailed report';
        }
    }

    function generateFakeIP() {
        // Generate a random IP for demonstration
        const ip = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
        ipValue.textContent = ip;
    }

    function getISP() {
        // Random ISP for demonstration
        const isp = isps[Math.floor(Math.random() * isps.length)];
        ispValue.textContent = isp;
    }

    function updateProtocol() {
        // Random protocol for demonstration
        const protocol = protocols[Math.floor(Math.random() * protocols.length)];
        protocolValue.textContent = protocol;
    }
});