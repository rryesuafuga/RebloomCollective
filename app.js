/**
 * Rebloom Collective - Interactive Website
 * D3.js Visualizations & GSAP Animations
 * Color-blind accessible design
 */

// =========================================
// CONFIGURATION & CONSTANTS
// =========================================

// Color-blind safe palette
const COLORS = {
    primary: '#2563eb',     // Blue
    accent: '#f59e0b',      // Amber
    teal: '#0d9488',        // Teal
    purple: '#7c3aed',      // Purple
    red: '#dc2626',         // Red
    emerald: '#059669',     // Emerald
    neutral: {
        900: '#171717',
        700: '#404040',
        500: '#737373',
        300: '#d4d4d4',
        100: '#f5f5f5',
    }
};

// Chart color palette (distinct for color blindness)
const CHART_COLORS = [
    COLORS.primary,
    COLORS.accent,
    COLORS.teal,
    COLORS.purple,
    COLORS.red,
    COLORS.emerald
];

// Pattern definitions for color-blind accessibility
const PATTERNS = ['solid', 'diagonal', 'horizontal', 'dots', 'crosshatch', 'vertical'];

// =========================================
// UTILITY FUNCTIONS
// =========================================

/**
 * Debounce function for resize handlers
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Format numbers with commas
 */
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Format currency
 */
function formatCurrency(num) {
    return '$' + formatNumber(num);
}

/**
 * Create SVG pattern definitions for accessibility
 */
function createPatternDefs(svg) {
    const defs = svg.append('defs');

    // Diagonal stripes pattern
    defs.append('pattern')
        .attr('id', 'pattern-diagonal')
        .attr('patternUnits', 'userSpaceOnUse')
        .attr('width', 8)
        .attr('height', 8)
        .append('path')
        .attr('d', 'M-2,2 l4,-4 M0,8 l8,-8 M6,10 l4,-4')
        .attr('stroke', '#ffffff')
        .attr('stroke-width', 2)
        .attr('opacity', 0.3);

    // Horizontal lines pattern
    defs.append('pattern')
        .attr('id', 'pattern-horizontal')
        .attr('patternUnits', 'userSpaceOnUse')
        .attr('width', 8)
        .attr('height', 8)
        .append('path')
        .attr('d', 'M0,4 L8,4')
        .attr('stroke', '#ffffff')
        .attr('stroke-width', 2)
        .attr('opacity', 0.3);

    // Dots pattern
    defs.append('pattern')
        .attr('id', 'pattern-dots')
        .attr('patternUnits', 'userSpaceOnUse')
        .attr('width', 8)
        .attr('height', 8)
        .append('circle')
        .attr('cx', 4)
        .attr('cy', 4)
        .attr('r', 2)
        .attr('fill', '#ffffff')
        .attr('opacity', 0.4);

    // Crosshatch pattern
    const crosshatch = defs.append('pattern')
        .attr('id', 'pattern-crosshatch')
        .attr('patternUnits', 'userSpaceOnUse')
        .attr('width', 8)
        .attr('height', 8);

    crosshatch.append('path')
        .attr('d', 'M0,0 L8,8 M8,0 L0,8')
        .attr('stroke', '#ffffff')
        .attr('stroke-width', 1.5)
        .attr('opacity', 0.3);

    // Vertical lines pattern
    defs.append('pattern')
        .attr('id', 'pattern-vertical')
        .attr('patternUnits', 'userSpaceOnUse')
        .attr('width', 8)
        .attr('height', 8)
        .append('path')
        .attr('d', 'M4,0 L4,8')
        .attr('stroke', '#ffffff')
        .attr('stroke-width', 2)
        .attr('opacity', 0.3);

    return defs;
}

/**
 * Create accessible tooltip
 */
function createTooltip() {
    return d3.select('body')
        .append('div')
        .attr('class', 'chart-tooltip')
        .attr('role', 'tooltip')
        .style('position', 'absolute')
        .style('visibility', 'hidden')
        .style('background', 'rgba(23, 23, 23, 0.95)')
        .style('color', 'white')
        .style('padding', '12px 16px')
        .style('border-radius', '8px')
        .style('font-size', '14px')
        .style('font-family', 'Inter, sans-serif')
        .style('box-shadow', '0 10px 25px rgba(0, 0, 0, 0.2)')
        .style('pointer-events', 'none')
        .style('z-index', '1000')
        .style('max-width', '250px');
}

// =========================================
// HERO SECTION VISUALIZATION
// =========================================

function createHeroVisualization() {
    const container = d3.select('#hero-visualization');
    if (container.empty()) return;

    const width = container.node().getBoundingClientRect().width || 500;
    const height = container.node().getBoundingClientRect().height || 400;

    // Clear any existing content
    container.selectAll('*').remove();

    const svg = container.append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('viewBox', `0 0 ${width} ${height}`)
        .attr('aria-hidden', 'true');

    createPatternDefs(svg);

    // Create interconnected circles representing the three crises
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.25;

    const crises = [
        { name: 'GBV', color: COLORS.primary, x: centerX, y: centerY - radius * 0.8, icon: 'shield' },
        { name: 'Period Poverty', color: COLORS.accent, x: centerX - radius * 0.9, y: centerY + radius * 0.6, icon: 'heart' },
        { name: 'Environment', color: COLORS.teal, x: centerX + radius * 0.9, y: centerY + radius * 0.6, icon: 'leaf' }
    ];

    // Create connecting lines
    svg.append('g')
        .attr('class', 'connections')
        .selectAll('line')
        .data([
            [crises[0], crises[1]],
            [crises[1], crises[2]],
            [crises[2], crises[0]]
        ])
        .enter()
        .append('line')
        .attr('x1', d => d[0].x)
        .attr('y1', d => d[0].y)
        .attr('x2', d => d[1].x)
        .attr('y2', d => d[1].y)
        .attr('stroke', COLORS.neutral[300])
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '8, 4')
        .style('opacity', 0.6);

    // Create crisis circles
    const circleGroups = svg.append('g')
        .attr('class', 'crisis-circles')
        .selectAll('g')
        .data(crises)
        .enter()
        .append('g')
        .attr('transform', d => `translate(${d.x}, ${d.y})`);

    // Outer glow
    circleGroups.append('circle')
        .attr('r', radius * 0.45)
        .attr('fill', d => d.color)
        .attr('opacity', 0.1);

    // Main circle
    circleGroups.append('circle')
        .attr('r', radius * 0.35)
        .attr('fill', d => d.color)
        .attr('opacity', 0.2)
        .attr('stroke', d => d.color)
        .attr('stroke-width', 2);

    // Inner circle
    circleGroups.append('circle')
        .attr('r', radius * 0.2)
        .attr('fill', d => d.color)
        .attr('opacity', 0.4);

    // Labels
    circleGroups.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', radius * 0.55)
        .attr('fill', COLORS.neutral[700])
        .attr('font-size', '14px')
        .attr('font-weight', '600')
        .text(d => d.name);

    // Animate the visualization
    if (typeof gsap !== 'undefined') {
        gsap.from('.crisis-circles circle', {
            scale: 0,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: 'elastic.out(1, 0.5)'
        });

        gsap.from('.connections line', {
            strokeDashoffset: 50,
            opacity: 0,
            duration: 1.5,
            stagger: 0.2,
            ease: 'power2.out'
        });
    }
}

// =========================================
// COMPARISON CHART (Problem Section)
// =========================================

function createComparisonChart() {
    const container = d3.select('#comparison-chart');
    if (container.empty()) return;

    const containerWidth = container.node().getBoundingClientRect().width;
    const margin = { top: 40, right: 30, bottom: 80, left: 60 };
    const width = Math.min(containerWidth, 900) - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    container.selectAll('*').remove();

    const svg = container.append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .attr('role', 'img')
        .attr('aria-label', 'Bar chart comparing Bukedi region statistics to Uganda national averages');

    createPatternDefs(svg);

    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    const data = [
        { metric: 'Sexual Violence Rate', bukedi: 37.1, national: 16.5, unit: '%' },
        { metric: 'Poverty Rate', bukedi: 35.7, national: 21.4, unit: '%' },
        { metric: 'Period Product Access Gap', bukedi: 65, national: 45, unit: '%' },
        { metric: 'School Dropout (Girls)', bukedi: 28, national: 23, unit: '%' }
    ];

    // X scale for metrics
    const x0 = d3.scaleBand()
        .domain(data.map(d => d.metric))
        .rangeRound([0, width])
        .paddingInner(0.3);

    // X scale for groups
    const x1 = d3.scaleBand()
        .domain(['bukedi', 'national'])
        .rangeRound([0, x0.bandwidth()])
        .padding(0.1);

    // Y scale
    const y = d3.scaleLinear()
        .domain([0, 70])
        .nice()
        .rangeRound([height, 0]);

    // Create axes
    const xAxis = g.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x0).tickSize(0));

    xAxis.selectAll('text')
        .attr('transform', 'rotate(-20)')
        .style('text-anchor', 'end')
        .attr('dx', '-0.5em')
        .attr('dy', '0.5em')
        .attr('fill', COLORS.neutral[700])
        .style('font-size', '12px');

    xAxis.select('.domain').attr('stroke', COLORS.neutral[300]);

    const yAxis = g.append('g')
        .attr('class', 'y-axis')
        .call(d3.axisLeft(y).ticks(5).tickFormat(d => d + '%'));

    yAxis.selectAll('text').attr('fill', COLORS.neutral[700]);
    yAxis.select('.domain').attr('stroke', COLORS.neutral[300]);
    yAxis.selectAll('.tick line').attr('stroke', COLORS.neutral[200]);

    // Add gridlines
    g.append('g')
        .attr('class', 'grid')
        .call(d3.axisLeft(y).ticks(5).tickSize(-width).tickFormat(''))
        .selectAll('.tick line')
        .attr('stroke', COLORS.neutral[200])
        .attr('stroke-dasharray', '3,3');

    g.select('.grid .domain').remove();

    // Tooltip
    const tooltip = createTooltip();

    // Create bar groups
    const barGroups = g.append('g')
        .selectAll('g')
        .data(data)
        .enter()
        .append('g')
        .attr('transform', d => `translate(${x0(d.metric)},0)`);

    // Bukedi bars
    barGroups.append('rect')
        .attr('x', x1('bukedi'))
        .attr('width', x1.bandwidth())
        .attr('y', height)
        .attr('height', 0)
        .attr('fill', COLORS.primary)
        .attr('rx', 4)
        .on('mouseenter', function(event, d) {
            d3.select(this).attr('opacity', 0.8);
            tooltip.style('visibility', 'visible')
                .html(`<strong>${d.metric}</strong><br>Bukedi: ${d.bukedi}${d.unit}`);
        })
        .on('mousemove', function(event) {
            tooltip
                .style('top', (event.pageY - 10) + 'px')
                .style('left', (event.pageX + 10) + 'px');
        })
        .on('mouseleave', function() {
            d3.select(this).attr('opacity', 1);
            tooltip.style('visibility', 'hidden');
        })
        .transition()
        .duration(800)
        .delay((d, i) => i * 100)
        .attr('y', d => y(d.bukedi))
        .attr('height', d => height - y(d.bukedi));

    // National bars
    barGroups.append('rect')
        .attr('x', x1('national'))
        .attr('width', x1.bandwidth())
        .attr('y', height)
        .attr('height', 0)
        .attr('fill', COLORS.accent)
        .attr('rx', 4)
        .on('mouseenter', function(event, d) {
            d3.select(this).attr('opacity', 0.8);
            tooltip.style('visibility', 'visible')
                .html(`<strong>${d.metric}</strong><br>National: ${d.national}${d.unit}`);
        })
        .on('mousemove', function(event) {
            tooltip
                .style('top', (event.pageY - 10) + 'px')
                .style('left', (event.pageX + 10) + 'px');
        })
        .on('mouseleave', function() {
            d3.select(this).attr('opacity', 1);
            tooltip.style('visibility', 'hidden');
        })
        .transition()
        .duration(800)
        .delay((d, i) => i * 100 + 50)
        .attr('y', d => y(d.national))
        .attr('height', d => height - y(d.national));

    // Add pattern overlay for accessibility
    barGroups.append('rect')
        .attr('x', x1('bukedi'))
        .attr('width', x1.bandwidth())
        .attr('y', d => y(d.bukedi))
        .attr('height', d => height - y(d.bukedi))
        .attr('fill', 'url(#pattern-diagonal)')
        .attr('pointer-events', 'none')
        .style('opacity', 0);

    // Legend
    const legend = svg.append('g')
        .attr('transform', `translate(${margin.left + width - 200}, 10)`);

    const legendItems = [
        { label: 'Bukedi Region', color: COLORS.primary },
        { label: 'National Average', color: COLORS.accent }
    ];

    legendItems.forEach((item, i) => {
        const legendRow = legend.append('g')
            .attr('transform', `translate(${i * 150}, 0)`);

        legendRow.append('rect')
            .attr('width', 16)
            .attr('height', 16)
            .attr('fill', item.color)
            .attr('rx', 3);

        legendRow.append('text')
            .attr('x', 22)
            .attr('y', 13)
            .attr('fill', COLORS.neutral[700])
            .style('font-size', '12px')
            .text(item.label);
    });
}

// =========================================
// PILLARS VISUALIZATION (Solution Section)
// =========================================

function createPillarsVisualization() {
    const container = d3.select('#pillars-visualization');
    if (container.empty()) return;

    const width = container.node().getBoundingClientRect().width;
    const height = 300;

    container.selectAll('*').remove();

    const svg = container.append('svg')
        .attr('width', '100%')
        .attr('height', height)
        .attr('viewBox', `0 0 ${width} ${height}`)
        .attr('aria-hidden', 'true');

    createPatternDefs(svg);

    const centerY = height / 2;
    const pillarWidth = width / 4;

    const pillars = [
        { name: 'GBV Center', color: COLORS.primary, x: pillarWidth },
        { name: 'Rebloom Pads', color: COLORS.accent, x: width / 2 },
        { name: 'CHE Network', color: COLORS.teal, x: width - pillarWidth }
    ];

    // Draw connecting arcs
    const arcGenerator = d3.arc()
        .innerRadius(80)
        .outerRadius(82)
        .startAngle(-Math.PI / 3)
        .endAngle(Math.PI / 3);

    // Connection 1-2
    svg.append('path')
        .attr('d', arcGenerator())
        .attr('transform', `translate(${(pillars[0].x + pillars[1].x) / 2}, ${centerY + 20}) rotate(90)`)
        .attr('fill', 'none')
        .attr('stroke', COLORS.neutral[300])
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '5,5');

    // Connection 2-3
    svg.append('path')
        .attr('d', arcGenerator())
        .attr('transform', `translate(${(pillars[1].x + pillars[2].x) / 2}, ${centerY + 20}) rotate(90)`)
        .attr('fill', 'none')
        .attr('stroke', COLORS.neutral[300])
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '5,5');

    // Draw pillars
    const pillarGroups = svg.selectAll('.pillar')
        .data(pillars)
        .enter()
        .append('g')
        .attr('class', 'pillar')
        .attr('transform', d => `translate(${d.x}, ${centerY})`);

    // Pillar circles
    pillarGroups.append('circle')
        .attr('r', 60)
        .attr('fill', d => d.color)
        .attr('opacity', 0.15);

    pillarGroups.append('circle')
        .attr('r', 45)
        .attr('fill', d => d.color)
        .attr('opacity', 0.3);

    pillarGroups.append('circle')
        .attr('r', 30)
        .attr('fill', d => d.color)
        .attr('opacity', 0.5);

    // Pillar labels
    pillarGroups.append('text')
        .attr('text-anchor', 'middle')
        .attr('y', 90)
        .attr('fill', COLORS.neutral[700])
        .attr('font-size', '14px')
        .attr('font-weight', '600')
        .text(d => d.name);

    // Center label
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', height - 20)
        .attr('text-anchor', 'middle')
        .attr('fill', COLORS.neutral[500])
        .attr('font-size', '13px')
        .text('Integrated Three-Pillar Model');

    // Animate
    if (typeof gsap !== 'undefined') {
        gsap.from('.pillar circle', {
            scale: 0,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'back.out(1.7)',
            scrollTrigger: {
                trigger: '#solution',
                start: 'top 70%'
            }
        });
    }
}

// =========================================
// JOURNEY VISUALIZATION (Journey Section)
// =========================================

function createJourneyVisualization() {
    const container = d3.select('#journey-visualization');
    if (container.empty()) return;

    const width = container.node().getBoundingClientRect().width;
    const height = 200;

    container.selectAll('*').remove();

    const svg = container.append('svg')
        .attr('width', '100%')
        .attr('height', height)
        .attr('viewBox', `0 0 ${width} ${height}`)
        .attr('aria-hidden', 'true');

    const stages = [
        { name: 'Referral', week: 'Week 1', color: COLORS.primary },
        { name: 'Healing', week: 'Weeks 2-8', color: COLORS.accent },
        { name: 'Training', week: 'Weeks 9-16', color: COLORS.teal },
        { name: 'Employment', week: 'Month 5+', color: COLORS.purple },
        { name: 'CHE Option', week: 'Month 8+', color: COLORS.emerald }
    ];

    const stageWidth = width / stages.length;
    const centerY = height / 2;

    // Draw path line
    const pathData = stages.map((s, i) => ({
        x: stageWidth * i + stageWidth / 2,
        y: centerY
    }));

    const lineGenerator = d3.line()
        .x(d => d.x)
        .y(d => d.y)
        .curve(d3.curveMonotoneX);

    // Background line
    svg.append('path')
        .attr('d', lineGenerator(pathData))
        .attr('fill', 'none')
        .attr('stroke', COLORS.neutral[200])
        .attr('stroke-width', 4);

    // Progress line (animated)
    const progressLine = svg.append('path')
        .attr('d', lineGenerator(pathData))
        .attr('fill', 'none')
        .attr('stroke', `url(#journey-gradient)`)
        .attr('stroke-width', 4)
        .attr('stroke-linecap', 'round');

    // Create gradient
    const defs = svg.append('defs');
    const gradient = defs.append('linearGradient')
        .attr('id', 'journey-gradient')
        .attr('x1', '0%')
        .attr('x2', '100%');

    stages.forEach((stage, i) => {
        gradient.append('stop')
            .attr('offset', `${(i / (stages.length - 1)) * 100}%`)
            .attr('stop-color', stage.color);
    });

    // Draw stage markers
    const stageGroups = svg.selectAll('.stage-marker')
        .data(stages)
        .enter()
        .append('g')
        .attr('class', 'stage-marker')
        .attr('transform', (d, i) => `translate(${stageWidth * i + stageWidth / 2}, ${centerY})`);

    // Outer circle
    stageGroups.append('circle')
        .attr('r', 25)
        .attr('fill', 'white')
        .attr('stroke', d => d.color)
        .attr('stroke-width', 3);

    // Inner circle
    stageGroups.append('circle')
        .attr('r', 12)
        .attr('fill', d => d.color);

    // Stage number
    stageGroups.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '0.35em')
        .attr('fill', 'white')
        .attr('font-size', '12px')
        .attr('font-weight', '700')
        .text((d, i) => i + 1);

    // Stage name above
    stageGroups.append('text')
        .attr('text-anchor', 'middle')
        .attr('y', -45)
        .attr('fill', COLORS.neutral[700])
        .attr('font-size', '13px')
        .attr('font-weight', '600')
        .text(d => d.name);

    // Week below
    stageGroups.append('text')
        .attr('text-anchor', 'middle')
        .attr('y', 50)
        .attr('fill', COLORS.neutral[500])
        .attr('font-size', '11px')
        .text(d => d.week);

    // Animate with GSAP
    if (typeof gsap !== 'undefined') {
        const pathLength = progressLine.node().getTotalLength();
        progressLine
            .attr('stroke-dasharray', pathLength)
            .attr('stroke-dashoffset', pathLength);

        gsap.to(progressLine.node(), {
            strokeDashoffset: 0,
            duration: 2,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '#journey',
                start: 'top 70%'
            }
        });

        gsap.from('.stage-marker', {
            scale: 0,
            opacity: 0,
            duration: 0.5,
            stagger: 0.15,
            ease: 'back.out(1.7)',
            scrollTrigger: {
                trigger: '#journey',
                start: 'top 70%'
            }
        });
    }
}

// =========================================
// SOCIAL IMPACT CHART
// =========================================

function createSocialImpactChart() {
    const container = d3.select('#social-impact-chart');
    if (container.empty()) return;

    const containerWidth = container.node().getBoundingClientRect().width;
    const margin = { top: 20, right: 30, bottom: 60, left: 50 };
    const width = containerWidth - margin.left - margin.right;
    const height = 280 - margin.top - margin.bottom;

    container.selectAll('*').remove();

    const svg = container.append('svg')
        .attr('width', containerWidth)
        .attr('height', 280);

    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    const data = [
        { metric: 'Survivors Enrolled', value: 50, icon: 'users' },
        { metric: 'Jobs Created', value: 15, icon: 'briefcase' },
        { metric: 'CHEs Active', value: 25, icon: 'network' },
        { metric: 'Girls Reached', value: 750, icon: 'heart' }
    ];

    const x = d3.scaleBand()
        .domain(data.map(d => d.metric))
        .range([0, width])
        .padding(0.4);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value) * 1.1])
        .range([height, 0]);

    // Y axis
    g.append('g')
        .call(d3.axisLeft(y).ticks(5).tickFormat(d => d >= 1000 ? (d / 1000) + 'k' : d))
        .selectAll('text')
        .attr('fill', 'rgba(255,255,255,0.7)');

    g.selectAll('.domain, .tick line').attr('stroke', 'rgba(255,255,255,0.2)');

    // Gridlines
    g.append('g')
        .call(d3.axisLeft(y).ticks(5).tickSize(-width).tickFormat(''))
        .selectAll('.tick line')
        .attr('stroke', 'rgba(255,255,255,0.1)');

    g.select('.domain').remove();

    // Bars
    const tooltip = createTooltip();

    g.selectAll('.bar')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', d => x(d.metric))
        .attr('width', x.bandwidth())
        .attr('y', height)
        .attr('height', 0)
        .attr('fill', (d, i) => CHART_COLORS[i])
        .attr('rx', 6)
        .on('mouseenter', function(event, d) {
            d3.select(this).attr('opacity', 0.8);
            tooltip.style('visibility', 'visible')
                .html(`<strong>${d.metric}</strong><br>Target: ${formatNumber(d.value)}+`);
        })
        .on('mousemove', function(event) {
            tooltip
                .style('top', (event.pageY - 10) + 'px')
                .style('left', (event.pageX + 10) + 'px');
        })
        .on('mouseleave', function() {
            d3.select(this).attr('opacity', 1);
            tooltip.style('visibility', 'hidden');
        })
        .transition()
        .duration(800)
        .delay((d, i) => i * 150)
        .attr('y', d => y(d.value))
        .attr('height', d => height - y(d.value));

    // Value labels
    g.selectAll('.label')
        .data(data)
        .enter()
        .append('text')
        .attr('class', 'label')
        .attr('x', d => x(d.metric) + x.bandwidth() / 2)
        .attr('y', d => y(d.value) - 10)
        .attr('text-anchor', 'middle')
        .attr('fill', 'white')
        .attr('font-size', '14px')
        .attr('font-weight', '700')
        .text(d => d.value >= 1000 ? (d.value / 1000) + 'k+' : d.value + '+')
        .style('opacity', 0)
        .transition()
        .delay((d, i) => 800 + i * 150)
        .duration(300)
        .style('opacity', 1);

    // X axis labels
    g.selectAll('.x-label')
        .data(data)
        .enter()
        .append('text')
        .attr('class', 'x-label')
        .attr('x', d => x(d.metric) + x.bandwidth() / 2)
        .attr('y', height + 20)
        .attr('text-anchor', 'middle')
        .attr('fill', 'rgba(255,255,255,0.7)')
        .attr('font-size', '11px')
        .each(function(d) {
            const text = d3.select(this);
            const words = d.metric.split(' ');
            words.forEach((word, i) => {
                text.append('tspan')
                    .attr('x', x(d.metric) + x.bandwidth() / 2)
                    .attr('dy', i === 0 ? 0 : 14)
                    .text(word);
            });
        });
}

// =========================================
// ENVIRONMENTAL IMPACT CHART
// =========================================

function createEnvironmentalImpactChart() {
    const container = d3.select('#environmental-impact-chart');
    if (container.empty()) return;

    const containerWidth = container.node().getBoundingClientRect().width;
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const width = containerWidth - margin.left - margin.right;
    const height = 280 - margin.top - margin.bottom;

    container.selectAll('*').remove();

    const svg = container.append('svg')
        .attr('width', containerWidth)
        .attr('height', 280);

    const g = svg.append('g')
        .attr('transform', `translate(${containerWidth / 2},${height / 2 + margin.top})`);

    const data = [
        { metric: 'Pads Prevented', value: 150000, display: '150K+', color: COLORS.primary },
        { metric: 'Plastic Waste (kg)', value: 750, display: '750kg', color: COLORS.accent },
        { metric: 'Years Decomposition Saved', value: 500, display: '500+', color: COLORS.teal },
        { metric: 'Waste Reduction', value: 97, display: '97%', color: COLORS.emerald }
    ];

    // Create a radial layout
    const angleScale = d3.scaleLinear()
        .domain([0, data.length])
        .range([0, 2 * Math.PI]);

    const radius = Math.min(width, height) / 2.5;

    // Draw connecting lines from center
    data.forEach((d, i) => {
        const angle = angleScale(i) - Math.PI / 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        g.append('line')
            .attr('x1', 0)
            .attr('y1', 0)
            .attr('x2', x)
            .attr('y2', y)
            .attr('stroke', 'rgba(255,255,255,0.2)')
            .attr('stroke-width', 1)
            .attr('stroke-dasharray', '4,4');
    });

    // Draw metric nodes
    const tooltip = createTooltip();

    const nodes = g.selectAll('.metric-node')
        .data(data)
        .enter()
        .append('g')
        .attr('class', 'metric-node')
        .attr('transform', (d, i) => {
            const angle = angleScale(i) - Math.PI / 2;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            return `translate(${x},${y})`;
        });

    nodes.append('circle')
        .attr('r', 40)
        .attr('fill', d => d.color)
        .attr('opacity', 0.3)
        .on('mouseenter', function(event, d) {
            d3.select(this).attr('opacity', 0.5);
            tooltip.style('visibility', 'visible')
                .html(`<strong>${d.metric}</strong><br>${d.display}`);
        })
        .on('mousemove', function(event) {
            tooltip
                .style('top', (event.pageY - 10) + 'px')
                .style('left', (event.pageX + 10) + 'px');
        })
        .on('mouseleave', function() {
            d3.select(this).attr('opacity', 0.3);
            tooltip.style('visibility', 'hidden');
        });

    nodes.append('circle')
        .attr('r', 28)
        .attr('fill', d => d.color)
        .attr('opacity', 0.6);

    nodes.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '0.35em')
        .attr('fill', 'white')
        .attr('font-size', '12px')
        .attr('font-weight', '700')
        .text(d => d.display);

    nodes.append('text')
        .attr('text-anchor', 'middle')
        .attr('y', 55)
        .attr('fill', 'rgba(255,255,255,0.8)')
        .attr('font-size', '10px')
        .each(function(d) {
            const text = d3.select(this);
            const words = d.metric.split(' ');
            words.forEach((word, i) => {
                text.append('tspan')
                    .attr('x', 0)
                    .attr('dy', i === 0 ? 0 : 12)
                    .text(word);
            });
        });

    // Center circle
    g.append('circle')
        .attr('r', 30)
        .attr('fill', 'rgba(255,255,255,0.1)')
        .attr('stroke', 'rgba(255,255,255,0.3)')
        .attr('stroke-width', 2);

    g.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '-0.3em')
        .attr('fill', 'white')
        .attr('font-size', '10px')
        .text('Year 1');

    g.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '1em')
        .attr('fill', 'rgba(255,255,255,0.7)')
        .attr('font-size', '9px')
        .text('Impact');

    // Animate
    if (typeof gsap !== 'undefined') {
        gsap.from('.metric-node', {
            scale: 0,
            opacity: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: 'back.out(1.7)',
            scrollTrigger: {
                trigger: '#impact',
                start: 'top 70%'
            }
        });
    }
}

// =========================================
// FINANCIAL PROJECTION CHART
// =========================================

function createFinancialChart() {
    const container = d3.select('#financial-chart');
    if (container.empty()) return;

    const containerWidth = container.node().getBoundingClientRect().width;
    const margin = { top: 30, right: 100, bottom: 50, left: 70 };
    const width = containerWidth - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;

    container.selectAll('*').remove();

    const svg = container.append('svg')
        .attr('width', containerWidth)
        .attr('height', 350);

    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    const data = [
        { year: 'Year 1', revenue: 14460, profit: 4810 },
        { year: 'Year 2', revenue: 28000, profit: 11200 },
        { year: 'Year 3', revenue: 45000, profit: 18000 }
    ];

    const x = d3.scaleBand()
        .domain(data.map(d => d.year))
        .range([0, width])
        .padding(0.5);

    const y = d3.scaleLinear()
        .domain([0, 50000])
        .range([height, 0]);

    // Gridlines
    g.append('g')
        .call(d3.axisLeft(y).ticks(5).tickSize(-width).tickFormat(''))
        .selectAll('.tick line')
        .attr('stroke', 'rgba(255,255,255,0.1)');

    g.selectAll('.domain').remove();

    // Y axis
    g.append('g')
        .call(d3.axisLeft(y).ticks(5).tickFormat(d => '$' + (d / 1000) + 'k'))
        .selectAll('text')
        .attr('fill', 'rgba(255,255,255,0.7)');

    g.selectAll('.tick line').attr('stroke', 'rgba(255,255,255,0.2)');

    // X axis
    g.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x).tickSize(0))
        .selectAll('text')
        .attr('fill', 'rgba(255,255,255,0.7)');

    g.selectAll('.domain').attr('stroke', 'rgba(255,255,255,0.2)');

    // Area for revenue
    const areaRevenue = d3.area()
        .x(d => x(d.year) + x.bandwidth() / 2)
        .y0(height)
        .y1(d => y(d.revenue))
        .curve(d3.curveMonotoneX);

    g.append('path')
        .datum(data)
        .attr('fill', COLORS.primary)
        .attr('fill-opacity', 0.3)
        .attr('d', areaRevenue);

    // Line for revenue
    const lineRevenue = d3.line()
        .x(d => x(d.year) + x.bandwidth() / 2)
        .y(d => y(d.revenue))
        .curve(d3.curveMonotoneX);

    const revenuePath = g.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', COLORS.primary)
        .attr('stroke-width', 3)
        .attr('d', lineRevenue);

    // Line for profit
    const lineProfit = d3.line()
        .x(d => x(d.year) + x.bandwidth() / 2)
        .y(d => y(d.profit))
        .curve(d3.curveMonotoneX);

    const profitPath = g.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', COLORS.accent)
        .attr('stroke-width', 3)
        .attr('d', lineProfit);

    // Animate lines
    [revenuePath, profitPath].forEach(path => {
        const length = path.node().getTotalLength();
        path.attr('stroke-dasharray', length)
            .attr('stroke-dashoffset', length)
            .transition()
            .duration(1500)
            .attr('stroke-dashoffset', 0);
    });

    // Data points
    const tooltip = createTooltip();

    // Revenue points
    g.selectAll('.revenue-point')
        .data(data)
        .enter()
        .append('circle')
        .attr('class', 'revenue-point')
        .attr('cx', d => x(d.year) + x.bandwidth() / 2)
        .attr('cy', d => y(d.revenue))
        .attr('r', 6)
        .attr('fill', COLORS.primary)
        .attr('stroke', 'white')
        .attr('stroke-width', 2)
        .style('cursor', 'pointer')
        .on('mouseenter', function(event, d) {
            d3.select(this).attr('r', 8);
            tooltip.style('visibility', 'visible')
                .html(`<strong>${d.year}</strong><br>Revenue: ${formatCurrency(d.revenue)}`);
        })
        .on('mousemove', function(event) {
            tooltip
                .style('top', (event.pageY - 10) + 'px')
                .style('left', (event.pageX + 10) + 'px');
        })
        .on('mouseleave', function() {
            d3.select(this).attr('r', 6);
            tooltip.style('visibility', 'hidden');
        });

    // Profit points
    g.selectAll('.profit-point')
        .data(data)
        .enter()
        .append('circle')
        .attr('class', 'profit-point')
        .attr('cx', d => x(d.year) + x.bandwidth() / 2)
        .attr('cy', d => y(d.profit))
        .attr('r', 6)
        .attr('fill', COLORS.accent)
        .attr('stroke', 'white')
        .attr('stroke-width', 2)
        .style('cursor', 'pointer')
        .on('mouseenter', function(event, d) {
            d3.select(this).attr('r', 8);
            tooltip.style('visibility', 'visible')
                .html(`<strong>${d.year}</strong><br>Net Profit: ${formatCurrency(d.profit)}`);
        })
        .on('mousemove', function(event) {
            tooltip
                .style('top', (event.pageY - 10) + 'px')
                .style('left', (event.pageX + 10) + 'px');
        })
        .on('mouseleave', function() {
            d3.select(this).attr('r', 6);
            tooltip.style('visibility', 'hidden');
        });

    // Legend
    const legend = svg.append('g')
        .attr('transform', `translate(${width + margin.left + 20}, ${margin.top + 20})`);

    const legendItems = [
        { label: 'Revenue', color: COLORS.primary },
        { label: 'Net Profit', color: COLORS.accent }
    ];

    legendItems.forEach((item, i) => {
        const legendRow = legend.append('g')
            .attr('transform', `translate(0, ${i * 30})`);

        legendRow.append('line')
            .attr('x1', 0)
            .attr('x2', 20)
            .attr('y1', 0)
            .attr('y2', 0)
            .attr('stroke', item.color)
            .attr('stroke-width', 3);

        legendRow.append('circle')
            .attr('cx', 10)
            .attr('cy', 0)
            .attr('r', 4)
            .attr('fill', item.color);

        legendRow.append('text')
            .attr('x', 28)
            .attr('y', 4)
            .attr('fill', 'rgba(255,255,255,0.8)')
            .attr('font-size', '12px')
            .text(item.label);
    });
}

// =========================================
// SROI VISUALIZATION
// =========================================

function createSROIVisualization() {
    const container = d3.select('#sroi-visualization');
    if (container.empty()) return;

    const size = 200;

    container.selectAll('*').remove();

    const svg = container.append('svg')
        .attr('width', size)
        .attr('height', size)
        .attr('viewBox', `0 0 ${size} ${size}`)
        .attr('aria-hidden', 'true');

    const centerX = size / 2;
    const centerY = size / 2;

    // Input circle ($1)
    svg.append('circle')
        .attr('cx', centerX - 40)
        .attr('cy', centerY)
        .attr('r', 30)
        .attr('fill', 'white')
        .attr('opacity', 0.2);

    svg.append('text')
        .attr('x', centerX - 40)
        .attr('y', centerY)
        .attr('text-anchor', 'middle')
        .attr('dy', '0.35em')
        .attr('fill', 'white')
        .attr('font-size', '16px')
        .attr('font-weight', '700')
        .text('$1');

    // Arrow
    svg.append('path')
        .attr('d', `M${centerX - 5} ${centerY} L${centerX + 20} ${centerY}`)
        .attr('stroke', 'white')
        .attr('stroke-width', 2)
        .attr('marker-end', 'url(#arrow)');

    // Arrow marker
    svg.append('defs').append('marker')
        .attr('id', 'arrow')
        .attr('viewBox', '0 0 10 10')
        .attr('refX', 9)
        .attr('refY', 5)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M 0 0 L 10 5 L 0 10 z')
        .attr('fill', 'white');

    // Output circle ($4-6)
    svg.append('circle')
        .attr('cx', centerX + 50)
        .attr('cy', centerY)
        .attr('r', 45)
        .attr('fill', 'white')
        .attr('opacity', 0.3);

    svg.append('text')
        .attr('x', centerX + 50)
        .attr('y', centerY)
        .attr('text-anchor', 'middle')
        .attr('dy', '0.35em')
        .attr('fill', 'white')
        .attr('font-size', '20px')
        .attr('font-weight', '700')
        .text('$4-6');

    // Label
    svg.append('text')
        .attr('x', centerX)
        .attr('y', size - 20)
        .attr('text-anchor', 'middle')
        .attr('fill', 'rgba(255,255,255,0.8)')
        .attr('font-size', '11px')
        .text('Social Return');
}

// =========================================
// REVENUE BREAKDOWN CHART
// =========================================

function createRevenueChart() {
    const container = d3.select('#revenue-chart');
    if (container.empty()) return;

    const width = 350;
    const height = 350;
    const radius = Math.min(width, height) / 2 - 20;

    container.selectAll('*').remove();

    const svg = container.append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${width / 2},${height / 2})`);

    const data = [
        { source: 'Pad Retail', value: 5100, percent: 35 },
        { source: 'NGO/School Bulk', value: 4600, percent: 32 },
        { source: 'CHE Network', value: 2600, percent: 18 },
        { source: 'Training', value: 2160, percent: 15 }
    ];

    const color = d3.scaleOrdinal()
        .domain(data.map(d => d.source))
        .range(CHART_COLORS);

    const pie = d3.pie()
        .value(d => d.value)
        .sort(null);

    const arc = d3.arc()
        .innerRadius(radius * 0.5)
        .outerRadius(radius);

    const arcHover = d3.arc()
        .innerRadius(radius * 0.5)
        .outerRadius(radius + 10);

    const tooltip = createTooltip();

    // Draw arcs
    const arcs = svg.selectAll('.arc')
        .data(pie(data))
        .enter()
        .append('g')
        .attr('class', 'arc');

    arcs.append('path')
        .attr('d', arc)
        .attr('fill', d => color(d.data.source))
        .attr('stroke', 'rgba(255,255,255,0.3)')
        .attr('stroke-width', 2)
        .style('cursor', 'pointer')
        .on('mouseenter', function(event, d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr('d', arcHover);
            tooltip.style('visibility', 'visible')
                .html(`<strong>${d.data.source}</strong><br>${formatCurrency(d.data.value)} (${d.data.percent}%)`);
        })
        .on('mousemove', function(event) {
            tooltip
                .style('top', (event.pageY - 10) + 'px')
                .style('left', (event.pageX + 10) + 'px');
        })
        .on('mouseleave', function() {
            d3.select(this)
                .transition()
                .duration(200)
                .attr('d', arc);
            tooltip.style('visibility', 'hidden');
        })
        .transition()
        .duration(1000)
        .attrTween('d', function(d) {
            const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
            return function(t) {
                return arc(interpolate(t));
            };
        });

    // Center text
    svg.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '-0.5em')
        .attr('fill', 'white')
        .attr('font-size', '24px')
        .attr('font-weight', '700')
        .text('$14,460');

    svg.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '1.2em')
        .attr('fill', 'rgba(255,255,255,0.7)')
        .attr('font-size', '12px')
        .text('Year 1 Revenue');

    // Create legend
    const legendContainer = d3.select('#revenue-legend');
    legendContainer.selectAll('*').remove();

    data.forEach((d, i) => {
        const item = legendContainer.append('div')
            .attr('class', 'legend-item');

        item.append('span')
            .attr('class', 'legend-color')
            .style('background-color', CHART_COLORS[i]);

        item.append('span')
            .text(`${d.source} (${d.percent}%)`);
    });
}

// =========================================
// PRODUCT VISUALIZATION
// =========================================

function createProductVisualization() {
    const container = d3.select('#product-visualization');
    if (container.empty()) return;

    const width = container.node().getBoundingClientRect().width;
    const height = 450;

    container.selectAll('*').remove();

    const svg = container.append('svg')
        .attr('width', '100%')
        .attr('height', height)
        .attr('viewBox', `0 0 ${width} ${height}`)
        .attr('aria-hidden', 'true');

    const centerX = width / 2;
    const centerY = height / 2;

    // Background circle
    svg.append('circle')
        .attr('cx', centerX)
        .attr('cy', centerY)
        .attr('r', 150)
        .attr('fill', COLORS.primary)
        .attr('opacity', 0.05);

    // Product representation - stylized pad shape
    const padGroup = svg.append('g')
        .attr('transform', `translate(${centerX}, ${centerY})`);

    // Main pad shape
    padGroup.append('ellipse')
        .attr('rx', 60)
        .attr('ry', 80)
        .attr('fill', 'white')
        .attr('stroke', COLORS.primary)
        .attr('stroke-width', 3);

    // Inner design
    padGroup.append('ellipse')
        .attr('rx', 45)
        .attr('ry', 60)
        .attr('fill', COLORS.primary)
        .attr('opacity', 0.1);

    // Center detail
    padGroup.append('ellipse')
        .attr('rx', 25)
        .attr('ry', 35)
        .attr('fill', COLORS.primary)
        .attr('opacity', 0.2);

    // Snap fasteners
    [-70, 70].forEach(x => {
        padGroup.append('circle')
            .attr('cx', x)
            .attr('cy', 0)
            .attr('r', 8)
            .attr('fill', COLORS.neutral[400])
            .attr('stroke', COLORS.neutral[500])
            .attr('stroke-width', 2);
    });

    // Feature labels around the product
    const features = [
        { label: 'Cotton Flannel', angle: -60, distance: 140 },
        { label: 'Absorbent Core', angle: 0, distance: 160 },
        { label: 'Waterproof Backing', angle: 60, distance: 140 },
        { label: 'Snap Fasteners', angle: 180, distance: 130 }
    ];

    features.forEach(f => {
        const angle = (f.angle * Math.PI) / 180;
        const x = Math.cos(angle) * f.distance;
        const y = Math.sin(angle) * f.distance;

        const featureGroup = svg.append('g')
            .attr('transform', `translate(${centerX + x}, ${centerY + y})`);

        featureGroup.append('circle')
            .attr('r', 6)
            .attr('fill', COLORS.accent);

        featureGroup.append('text')
            .attr('x', f.angle > 90 || f.angle < -90 ? -12 : 12)
            .attr('y', 4)
            .attr('text-anchor', f.angle > 90 || f.angle < -90 ? 'end' : 'start')
            .attr('fill', COLORS.neutral[700])
            .attr('font-size', '12px')
            .attr('font-weight', '500')
            .text(f.label);

        // Connecting line
        svg.append('line')
            .attr('x1', centerX + x * 0.3)
            .attr('y1', centerY + y * 0.3)
            .attr('x2', centerX + x * 0.85)
            .attr('y2', centerY + y * 0.85)
            .attr('stroke', COLORS.neutral[300])
            .attr('stroke-width', 1)
            .attr('stroke-dasharray', '4,4');
    });

    // "Kit of 4" badge
    svg.append('g')
        .attr('transform', `translate(${centerX + 100}, ${centerY - 120})`)
        .call(g => {
            g.append('rect')
                .attr('x', -40)
                .attr('y', -15)
                .attr('width', 80)
                .attr('height', 30)
                .attr('rx', 15)
                .attr('fill', COLORS.accent);

            g.append('text')
                .attr('text-anchor', 'middle')
                .attr('dy', '0.35em')
                .attr('fill', 'white')
                .attr('font-size', '12px')
                .attr('font-weight', '600')
                .text('Kit of 4');
        });

    // Animate
    if (typeof gsap !== 'undefined') {
        gsap.from(padGroup.node(), {
            scale: 0,
            rotation: -10,
            duration: 1,
            ease: 'elastic.out(1, 0.5)',
            scrollTrigger: {
                trigger: '#products',
                start: 'top 70%'
            }
        });
    }
}

// =========================================
// ENVIRONMENTAL COMPARISON CHART
// =========================================

function createEnvComparisonChart() {
    const container = d3.select('#env-comparison-chart');
    if (container.empty()) return;

    const containerWidth = container.node().getBoundingClientRect().width;
    const margin = { top: 40, right: 30, bottom: 60, left: 160 };
    const width = Math.min(containerWidth, 800) - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;

    container.selectAll('*').remove();

    const svg = container.append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);

    createPatternDefs(svg);

    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    const data = [
        { metric: 'Cost over 3 years', reusable: 4, disposable: 50 },
        { metric: 'Pads used (3 years)', reusable: 4, disposable: 720 },
        { metric: 'Plastic waste (grams)', reusable: 0, disposable: 2880 },
        { metric: 'Decomposition time (years)', reusable: 1, disposable: 500 }
    ];

    const y = d3.scaleBand()
        .domain(data.map(d => d.metric))
        .range([0, height])
        .padding(0.3);

    const x = d3.scaleLinear()
        .domain([0, d3.max(data, d => Math.max(d.reusable, d.disposable)) * 1.1])
        .range([0, width]);

    // Y axis
    g.append('g')
        .call(d3.axisLeft(y).tickSize(0))
        .selectAll('text')
        .attr('fill', COLORS.neutral[700])
        .style('font-size', '12px');

    g.selectAll('.domain').attr('stroke', COLORS.neutral[300]);

    // Gridlines
    g.append('g')
        .call(d3.axisBottom(x).ticks(5).tickSize(height).tickFormat(''))
        .attr('transform', 'translate(0,0)')
        .selectAll('.tick line')
        .attr('stroke', COLORS.neutral[200])
        .attr('stroke-dasharray', '3,3');

    g.selectAll('.domain').remove();

    const tooltip = createTooltip();
    const barHeight = y.bandwidth() / 2 - 4;

    // Reusable bars
    g.selectAll('.bar-reusable')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'bar-reusable')
        .attr('y', d => y(d.metric))
        .attr('height', barHeight)
        .attr('x', 0)
        .attr('width', 0)
        .attr('fill', COLORS.teal)
        .attr('rx', 4)
        .on('mouseenter', function(event, d) {
            tooltip.style('visibility', 'visible')
                .html(`<strong>Rebloom Pads</strong><br>${d.metric}: ${formatNumber(d.reusable)}`);
        })
        .on('mousemove', function(event) {
            tooltip
                .style('top', (event.pageY - 10) + 'px')
                .style('left', (event.pageX + 10) + 'px');
        })
        .on('mouseleave', function() {
            tooltip.style('visibility', 'hidden');
        })
        .transition()
        .duration(800)
        .delay((d, i) => i * 100)
        .attr('width', d => x(d.reusable));

    // Disposable bars
    g.selectAll('.bar-disposable')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'bar-disposable')
        .attr('y', d => y(d.metric) + barHeight + 8)
        .attr('height', barHeight)
        .attr('x', 0)
        .attr('width', 0)
        .attr('fill', COLORS.red)
        .attr('opacity', 0.7)
        .attr('rx', 4)
        .on('mouseenter', function(event, d) {
            tooltip.style('visibility', 'visible')
                .html(`<strong>Disposable Pads</strong><br>${d.metric}: ${formatNumber(d.disposable)}`);
        })
        .on('mousemove', function(event) {
            tooltip
                .style('top', (event.pageY - 10) + 'px')
                .style('left', (event.pageX + 10) + 'px');
        })
        .on('mouseleave', function() {
            tooltip.style('visibility', 'hidden');
        })
        .transition()
        .duration(800)
        .delay((d, i) => i * 100 + 50)
        .attr('width', d => x(d.disposable));

    // Legend
    const legend = svg.append('g')
        .attr('transform', `translate(${margin.left + width - 250}, 10)`);

    const legendItems = [
        { label: 'Rebloom Reusable', color: COLORS.teal },
        { label: 'Disposable Pads', color: COLORS.red }
    ];

    legendItems.forEach((item, i) => {
        const legendRow = legend.append('g')
            .attr('transform', `translate(${i * 150}, 0)`);

        legendRow.append('rect')
            .attr('width', 16)
            .attr('height', 16)
            .attr('fill', item.color)
            .attr('opacity', item.color === COLORS.red ? 0.7 : 1)
            .attr('rx', 3);

        legendRow.append('text')
            .attr('x', 22)
            .attr('y', 13)
            .attr('fill', COLORS.neutral[700])
            .style('font-size', '12px')
            .text(item.label);
    });
}

// =========================================
// NAVIGATION FUNCTIONALITY
// =========================================

function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    let lastScrollY = window.scrollY;

    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
        });

        // Close menu on link click
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // Scroll behavior
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        // Add background on scroll
        if (currentScrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }

        // Hide/show navbar on scroll
        if (currentScrollY > lastScrollY && currentScrollY > 300) {
            navbar.classList.add('hidden');
        } else {
            navbar.classList.remove('hidden');
        }

        lastScrollY = currentScrollY;
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navHeight = navbar.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// =========================================
// COUNTER ANIMATION
// =========================================

function animateCounters() {
    const counters = document.querySelectorAll('.stat-value[data-count]');

    counters.forEach(counter => {
        const target = parseFloat(counter.getAttribute('data-count'));
        const duration = 2000;
        const start = performance.now();

        function updateCounter(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = target * easeOutQuart;

            if (target % 1 !== 0) {
                counter.textContent = current.toFixed(1);
            } else {
                counter.textContent = Math.round(current);
            }

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        }

        // Start animation when element is visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    requestAnimationFrame(updateCounter);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(counter);
    });
}

// =========================================
// GSAP SCROLL ANIMATIONS
// =========================================

function initScrollAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn('GSAP or ScrollTrigger not loaded');
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Fade in sections
    gsap.utils.toArray('.section-header').forEach(header => {
        gsap.from(header.children, {
            y: 40,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: header,
                start: 'top 80%'
            }
        });
    });

    // Crisis cards
    gsap.from('.crisis-card', {
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.crisis-grid',
            start: 'top 80%'
        }
    });

    // Pillar cards
    gsap.from('.pillar-card', {
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.pillars-grid',
            start: 'top 80%'
        }
    });

    // Journey stages
    gsap.from('.journey-stage', {
        x: -40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.journey-stages',
            start: 'top 80%'
        }
    });

    // Impact categories
    gsap.from('.impact-category', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.impact-dashboard',
            start: 'top 80%'
        }
    });

    // Involvement cards
    gsap.from('.involvement-card', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.involvement-options',
            start: 'top 80%'
        }
    });

    // Advantage cards
    gsap.from('.advantage-card', {
        scale: 0.9,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'back.out(1.7)',
        scrollTrigger: {
            trigger: '.advantages-grid',
            start: 'top 80%'
        }
    });

    // Quote animation
    gsap.from('.survivor-quote', {
        scale: 0.95,
        opacity: 0,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.survivor-quote',
            start: 'top 80%'
        }
    });

    // Hero title animation
    gsap.from('.title-line', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out',
        delay: 0.3
    });

    // Hero badge and description
    gsap.from('.hero-badge', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
        delay: 0.1
    });

    gsap.from('.hero-description', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
        delay: 0.8
    });

    // Hero stats
    gsap.from('.stat-item', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        delay: 1
    });

    // Hero actions
    gsap.from('.hero-actions', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
        delay: 1.3
    });
}

// =========================================
// FORM HANDLING
// =========================================

function initContactForm() {
    const form = document.getElementById('contact-form');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            // Simple validation
            if (!data.name || !data.email || !data.interest) {
                alert('Please fill in all required fields.');
                return;
            }

            // Simulate form submission
            const submitBtn = form.querySelector('.btn-submit');
            const originalText = submitBtn.innerHTML;

            submitBtn.innerHTML = 'Sending...';
            submitBtn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                submitBtn.innerHTML = 'Message Sent!';
                submitBtn.style.background = COLORS.teal;

                // Reset form
                setTimeout(() => {
                    form.reset();
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 2000);
            }, 1500);
        });
    }
}

// =========================================
// INITIALIZATION
// =========================================

function initAllVisualizations() {
    createHeroVisualization();
    createComparisonChart();
    createPillarsVisualization();
    createJourneyVisualization();
    createSocialImpactChart();
    createEnvironmentalImpactChart();
    createFinancialChart();
    createSROIVisualization();
    createRevenueChart();
    createProductVisualization();
    createEnvComparisonChart();
}

// Handle resize
const handleResize = debounce(() => {
    initAllVisualizations();
}, 250);

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize navigation
    initNavigation();

    // Initialize visualizations
    initAllVisualizations();

    // Initialize counter animations
    animateCounters();

    // Initialize scroll animations
    initScrollAnimations();

    // Initialize contact form
    initContactForm();

    // Handle window resize
    window.addEventListener('resize', handleResize);
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    window.removeEventListener('resize', handleResize);
});
