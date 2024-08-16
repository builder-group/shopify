import { DialogTrigger, DotsVerticalIcon, LogoIcon } from '@repo/ui';
import React, { MouseEventHandler, useState } from 'react';

export const Launcher: React.FC<TProps> = (props) => {
	const { defaultTop = 100, topOffset = 85, bottomOffset = 10 } = props;
	const [currentTop, setCurrentTop] = useState(defaultTop);
	const [isDragging, setIsDragging] = useState(false);
	const [startY, setStartY] = useState(0);
	const [startTop, setStartTop] = useState(0);

	// Handle the start of dragging
	const onMouseDown: MouseEventHandler<HTMLDivElement> = React.useCallback(
		(event) => {
			setIsDragging(true);
			setStartY(event.clientY);
			setStartTop(currentTop);
			// document.body.style.pointerEvents = 'none';
			// document.body.style.cursor = 'move';
		},
		[currentTop]
	);

	// Handle dragging motion
	const onMouseMove = React.useCallback(
		(event: WindowEventMap['mousemove']) => {
			if (isDragging) {
				const deltaY = event.clientY - startY;
				let newTop = startTop + deltaY;

				// Apply constraints
				const maxTop = window.innerHeight - bottomOffset - 56; // 56 is the height of the sidebar
				const minTop = topOffset;
				if (newTop < minTop) newTop = minTop;
				if (newTop > maxTop) newTop = maxTop;

				setCurrentTop(newTop);
			}
		},
		[isDragging, startY, startTop]
	);

	// Handle end of dragging
	const onMouseUp = React.useCallback(() => {
		setIsDragging(false);
		// document.body.style.pointerEvents = '';
		// document.body.style.cursor = '';
	}, []);

	// Add/remove event listeners based on dragging state
	useEffect(() => {
		if (isDragging) {
			window.addEventListener('mousemove', onMouseMove);
			window.addEventListener('mouseup', onMouseUp);
		} else {
			window.removeEventListener('mousemove', onMouseMove);
			window.removeEventListener('mouseup', onMouseUp);
		}

		return () => {
			window.removeEventListener('mousemove', onMouseMove);
			window.removeEventListener('mouseup', onMouseUp);
		};
	}, [isDragging, onMouseMove, onMouseUp]);

	return (
		<div className="fixed right-0" style={{ top: currentTop }}>
			<div className="flex items-center rounded-l-xl bg-[rgba(246,246,246,0.36)] bg-gradient-to-r from-[#fde200]/5 to-[#d4b000]/5 p-2 pr-0 shadow-[0_0_32px_rgba(0,0,0,0.2),inset_0_0_0_1px_rgba(255,255,255,0.34)] backdrop-blur-3xl">
				<DialogTrigger asChild>
					<div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-gradient-to-b from-[#fde200] to-[#d4b000] shadow-[inset_0_-2px_5px_rgba(0,0,0,0.2)]">
						<LogoIcon className="h-5 w-5" />
					</div>
				</DialogTrigger>
				<div
					className="flex h-10 cursor-move items-center justify-center"
					onMouseDown={onMouseDown}
				>
					<DotsVerticalIcon className="h-4 w-4" />
				</div>
			</div>
		</div>
	);
};

interface TProps {
	topOffset?: number;
	bottomOffset?: number;
	defaultTop?: number;
}
