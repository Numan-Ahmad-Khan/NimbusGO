import { useRef, useState } from "react";

export default function SwipeButton({
    onAccept,
    disabled = false
}) {
    const containerRef = useRef(null);

    const [dragging, setDragging] = useState(false);
    const [position, setPosition] = useState(0);

    function handlePointerDown(event) {
        if (disabled) {
            return;
        }

        event.currentTarget.setPointerCapture(
            event.pointerId
        );

        setDragging(true);
    }

    function handlePointerMove(event) {
        if (!dragging || disabled) {
            return;
        }

        const container =
            containerRef.current;

        if (!container) {
            return;
        }

        const rect =
            container.getBoundingClientRect();

        const buttonWidth = 56;

        const maxPosition =
            rect.width - buttonWidth;

        let newPosition =
            event.clientX -
            rect.left -
            buttonWidth / 2;

        newPosition = Math.max(
            0,
            Math.min(
                newPosition,
                maxPosition
            )
        );

        setPosition(newPosition);
    }

    function handlePointerUp() {
        if (!dragging) {
            return;
        }

        setDragging(false);

        const container =
            containerRef.current;

        if (!container) {
            return;
        }

        const maxPosition =
            container.offsetWidth - 56;

        if (position >= maxPosition * 0.75) {
            setPosition(maxPosition);

            onAccept();

            setTimeout(() => {
                setPosition(0);
            }, 400);

            return;
        }

        setPosition(0);
    }

    return (
        <div
            ref={containerRef}
            className="
                relative h-14
                overflow-hidden
                rounded-2xl
                bg-black
                select-none
                touch-none
            "
        >
            <div className="
                absolute inset-0
                flex items-center
                justify-center
                text-sm font-medium
                text-white
            ">
                Swipe to accept →
            </div>

            <div
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                style={{
                    transform:
                        `translateX(${position}px)`
                }}
                className="
                    absolute left-1 top-1
                    flex h-12 w-12
                    cursor-grab
                    items-center
                    justify-center
                    rounded-xl
                    bg-white
                    text-black
                    shadow-sm
                    active:cursor-grabbing
                "
            >
                →
            </div>
        </div>
    );
}