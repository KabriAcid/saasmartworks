"use client";

import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

type CarouselImage = {
	src: string;
	alt: string;
	credit: string;
};

type ImageCarouselProps = {
	images: readonly CarouselImage[];
	label: string;
	description: string;
	contained?: boolean;
};

export function ImageCarousel({
	images,
	label,
	description,
	contained = false,
}: ImageCarouselProps) {
	const [activeIndex, setActiveIndex] = useState(0);
	const [paused, setPaused] = useState(false);

	useEffect(() => {
		if (paused || images.length < 2) return;
		const timer = window.setInterval(() => {
			setActiveIndex((current) => (current + 1) % images.length);
		}, 5500);
		return () => window.clearInterval(timer);
	}, [images.length, paused]);

	const activeImage = images[activeIndex];
	const move = (direction: number) => {
		setActiveIndex(
			(current) => (current + direction + images.length) % images.length,
		);
	};

	return (
		<section
			className={`service-carousel${contained ? " service-carousel-contained" : ""}`}
			aria-label={label}
			aria-roledescription="carousel"
			onMouseEnter={() => setPaused(true)}
			onMouseLeave={() => setPaused(false)}
		>
			<div className="service-carousel-frame">
				<Image
					key={activeIndex}
					className="service-carousel-image"
					src={activeImage.src}
					alt={activeImage.alt}
					fill
					priority
					sizes="(max-width: 768px) 100vw, 1200px"
				/>
				<div className="service-carousel-shade" />
				<div
					className="service-carousel-caption"
					key={`caption-${activeIndex}`}
				>
					<span>{activeImage.credit}</span>
					<strong>{label}</strong>
					<p>{description}</p>
				</div>
				<div
					className="service-carousel-progress"
					role="tablist"
					aria-label="Carousel slides"
				>
					{images.map((image, index) => (
						<button
							aria-label={`Show ${image.credit} slide`}
							aria-selected={activeIndex === index}
							className={activeIndex === index ? "active" : ""}
							key={image.credit}
							type="button"
							onClick={() => setActiveIndex(index)}
						/>
					))}
				</div>
				<div className="service-carousel-controls">
					<button
						type="button"
						onClick={() => move(-1)}
						aria-label="Previous image"
					>
						<ChevronLeftIcon aria-hidden="true" />
					</button>
					<span aria-live="polite">
						{String(activeIndex + 1).padStart(2, "0")} /{" "}
						{String(images.length).padStart(2, "0")}
					</span>
					<button type="button" onClick={() => move(1)} aria-label="Next image">
						<ChevronRightIcon aria-hidden="true" />
					</button>
				</div>
			</div>
		</section>
	);
}
