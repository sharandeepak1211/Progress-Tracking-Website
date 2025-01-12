import React from "react";

interface ProgressIconProps {
	width?: number;
	height?: number;
	className?: string;
}

const ProgressIcon: React.FC<ProgressIconProps> = ({ width = 32, height = 32, className = "" }) => {
	try {
		return (
			<svg width={width} height={height} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" className={className}>
				<defs>
					<linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
						<stop offset="0%" style={{ stopColor: "#4CAF50" }} />
						<stop offset="100%" style={{ stopColor: "#45a049" }} />
					</linearGradient>
					<filter id="glow">
						<feGaussianBlur stdDeviation="1" result="coloredBlur" />
						<feMerge>
							<feMergeNode in="coloredBlur" />
							<feMergeNode in="SourceGraphic" />
						</feMerge>
					</filter>
				</defs>
				<circle cx="16" cy="16" r="15" fill="url(#greenGradient)" stroke="#2E7D32" strokeWidth="2" filter="url(#glow)" />
				<path d="M8 16 L14 22 L24 10" stroke="#ffffff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" filter="url(#glow)" />
			</svg>
		);
	} catch (error) {
		console.error({ error: "Error rendering ProgressIcon", details: error });
		throw new Error("Failed to render ProgressIcon");
	}
};

export default ProgressIcon;
