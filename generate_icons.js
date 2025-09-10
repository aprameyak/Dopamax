const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

function generateIcon(size, filename) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    
    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, '#8B5CF6');
    gradient.addColorStop(1, '#A855F7');
    
    // Draw background
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    
    // Add rounded corners
    ctx.globalCompositeOperation = 'destination-in';
    ctx.beginPath();
    ctx.arc(size/2, size/2, size/2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    
    const centerX = size / 2;
    const centerY = size / 2;
    const iconSize = size * 0.6;
    
    // Draw progress ring (outer circle)
    const ringRadius = iconSize * 0.45;
    const ringWidth = size * 0.08;
    
    // Background ring (incomplete)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = ringWidth;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(centerX, centerY, ringRadius, 0, 2 * Math.PI);
    ctx.stroke();
    
    // Progress ring (completed portion - 75% complete)
    ctx.strokeStyle = 'white';
    ctx.beginPath();
    ctx.arc(centerX, centerY, ringRadius, -Math.PI/2, -Math.PI/2 + (2 * Math.PI * 0.75));
    ctx.stroke();
    
    // Draw dopamine molecule structure
    const moleculeSize = iconSize * 0.35;
    
    // Central benzene ring (hexagon)
    const hexagonRadius = moleculeSize * 0.25;
    ctx.strokeStyle = 'white';
    ctx.lineWidth = size * 0.015;
    ctx.lineCap = 'round';
    
    // Draw hexagon
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        const x = centerX + hexagonRadius * Math.cos(angle);
        const y = centerY + hexagonRadius * Math.sin(angle);
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.closePath();
    ctx.stroke();
    
    // Draw atoms at hexagon vertices
    ctx.fillStyle = 'white';
    for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        const x = centerX + hexagonRadius * Math.cos(angle);
        const y = centerY + hexagonRadius * Math.sin(angle);
        
        ctx.beginPath();
        ctx.arc(x, y, moleculeSize * 0.08, 0, 2 * Math.PI);
        ctx.fill();
    }
    
    // Draw side chains (dopamine functional groups)
    const sideChainLength = moleculeSize * 0.2;
    const sideChainPositions = [
        { angle: Math.PI/6, offset: 0.3 },
        { angle: -Math.PI/6, offset: 0.3 },
        { angle: Math.PI/2, offset: 0.4 }
    ];
    
    sideChainPositions.forEach(({ angle, offset }) => {
        const startX = centerX + hexagonRadius * Math.cos(angle);
        const startY = centerY + hexagonRadius * Math.sin(angle);
        const endX = startX + sideChainLength * Math.cos(angle + offset);
        const endY = startY + sideChainLength * Math.sin(angle + offset);
        
        // Draw bond line
        ctx.strokeStyle = 'white';
        ctx.lineWidth = size * 0.012;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        
        // Draw terminal atom
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(endX, endY, moleculeSize * 0.06, 0, 2 * Math.PI);
        ctx.fill();
    });
    
    // Add small progress indicators (dots) around the ring
    const progressDots = 8;
    const dotRadius = size * 0.02;
    ctx.fillStyle = 'white';
    
    for (let i = 0; i < progressDots; i++) {
        const angle = (i * Math.PI * 2) / progressDots;
        const dotX = centerX + (ringRadius + ringWidth/2) * Math.cos(angle);
        const dotY = centerY + (ringRadius + ringWidth/2) * Math.sin(angle);
        
        // Only show dots for completed portion (75%)
        if (i < progressDots * 0.75) {
            ctx.beginPath();
            ctx.arc(dotX, dotY, dotRadius, 0, 2 * Math.PI);
            ctx.fill();
        }
    }
    
    // Add subtle glow effect
    ctx.shadowColor = 'rgba(255, 255, 255, 0.3)';
    ctx.shadowBlur = size * 0.05;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    
    // Save the image
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(path.join('assets', filename), buffer);
}

// Create assets directory if it doesn't exist
if (!fs.existsSync('assets')) {
    fs.mkdirSync('assets');
}

// Generate all required icons
generateIcon(1024, 'icon.png');
generateIcon(512, 'adaptive-icon.png');
generateIcon(192, 'splash-icon.png');
generateIcon(32, 'favicon.png');
