import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { FaRegGrinAlt } from 'react-icons/fa';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

function Input() {
	const [text, setText] = useState('');
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);





	const handleTextChange = (value) => {
		setText(value);
	};

	const handleEmojiSelect = (emoji) => {
		setText(text + emoji.native);
	};

	const modules = {
		toolbar: [
			[{ header: [1, 2, false] }],
			['bold', 'italic', 'strike'],
			// [{ emoji: '' }],
		],
	};

	const formats = ['header', 'bold', 'italic', 'strike', 'emoji'];

	const toggleEmojiPicker = () => {
		setShowEmojiPicker(!showEmojiPicker);
	};

	return (
		<>
			{showEmojiPicker && (
				<div className='z-10 absolute left-20'>
					<Picker data={data} onEmojiSelect={handleEmojiSelect} />
				</div>
			)}
			<div className='flex h-10'>
				<button
					className='p-2 hover:bg-gray-200 border'
					onClick={toggleEmojiPicker}
					title='Seleccionar emoji'
				>
					<FaRegGrinAlt className='text-xl' />
				</button>
			</div>
			<ReactQuill
				value={text}
				onChange={handleTextChange}
				modules={modules}
				formats={formats}
			/>
		</>
	);
}

export default Input;
