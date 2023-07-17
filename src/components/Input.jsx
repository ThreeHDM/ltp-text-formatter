import React, { useRef, useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import quillEmoji from 'quill-emoji';
import './customFontStyle';

import 'react-quill/dist/quill.snow.css';
import 'quill-emoji/dist/quill-emoji.css';
import Swal from 'sweetalert2';

function Input() {
	const editorRef = useRef(null);
	const [empty, setTextEmpty] = useState(true);
	const [textToFormat, setTextToFormat] = useState('');
	const [formattedText, setFormattedText] = useState('');

	useEffect(() => {
		const lastSession = localStorage.getItem('textToFormat');
		if (editorRef.current) {
			const editor = editorRef.current.getEditor();
			editor.clipboard.dangerouslyPasteHTML(lastSession);
		}
	}, []);

	const modules = {
		toolbar: [
			[{ font: ['sans-serif', 'monospace'] }],
			['bold', 'italic', 'strike'],
			[{ list: 'ordered' }, { list: 'bullet' }],
			['emoji'],
			['clean'],
		],
		'emoji-toolbar': true,
		'emoji-textarea': false,
		'emoji-shortname': true,
	};

	const formats = [
		'font',
		'bold',
		'italic',
		'strike',
		'list',
		'bullet',
		'emoji',
	];

	const handleFormat = (e, delta, source, editor) => {
		setTextEmpty(!editor.getText());
		setTextToFormat(editor.getHTML());

		if (!empty && formattedText) {
			setFormattedText('');
		}
		localStorage.setItem('textToFormat', editor.getHTML());
	};

	const ulReplace = (match, innerContent) => {
		const formattedList = innerContent
			.replace(/<li class="ql-indent-1">(.*?)<\/li>/g, '    •$1\n')
			.replace(/<li>(.*?)<\/li>/gi, '•$1\n')
			.replace(/<a.*?href="(.*?)".*?>(.*?)<\/a>/gi, '$2')
			.replace(/<strong>(.*?)<\/strong>/gi, '*$1*')
			.replace(/<em>(.*?)<\/em>/gi, '_$1_')
			.replace(/<s>(.*?)<\/s>/gi, '~$1~');

		return `\n${formattedList}`;
	};
	const olReplace = (match, innerContent) => {
		let listItemIndex = 1;
		let indentationLevel = 0;
		let useLetters = false;
		const firstIndentation = '      ';
		const formattedList = innerContent.replace(
			/<li.*?>(.*?)<\/li>/gi,
			(match, listItemContent) => {
				let indentation = '\t'.repeat(indentationLevel);
				let prefix;

				if (match.includes('ql-indent-')) {
					useLetters = true;
				} else {
					useLetters = false;
				}
				if (useLetters) {
					prefix = firstIndentation + String.fromCharCode(94 + listItemIndex);
					listItemIndex++;
				} else {
					prefix = listItemIndex;
					listItemIndex++;
				}
				const formattedItem = `${firstIndentation}${prefix}. ${indentation}${listItemContent.trim()}\n`;
				return formattedItem;
			}
		);

		return `\n${formattedList}`;
	};

	const formatTextToWhatsApp = () => {
		if (!textToFormat) {
			Swal.fire({
				icon: 'error',
				title: 'No hay texto',
				text: 'Por favor, ingresa un texto antes de formatear y copiar al portapapeles.',
				timer: 3000,
				showConfirmButton: false,
			});
			return;
		}
		const textFormatted = textToFormat
			.replace(/<ul>(.*?)<\/ul>/gi, ulReplace)
			.replace(/<ol>(.*?)<\/ol>/gi, olReplace)
			.replace(/(<p>.*?<\/p>)(\s*(?:<ol>|<ul>))/gi, '$1\n$2')
			.replace(/<\/?p>/gi, '')
			.replace(/<br\s*\/?>/gi, '\n')
			.replace(/<li class="ql-indent-1">(.*?)<\/li>/g, '    $1\n')
			.replace(/<span class="ql-font-monospace">(.*?)<\/span>/g, '```$1```')
			.replace(/<span class="ql-font-sans-serif">(.*?)<\/span>/g, '$1')
			.replace(/<a.*?href="(.*?)".*?>(.*?)<\/a>/g, '$2')
			.replace(/<\/p>/g, '')
			.replace(/\n\s*\n/g, '\n')
			.replace(/<strong(?:\s+[^>]+)?>(.*?)<\/strong>/gi, '*$1*')
			.replace(/<em(?:\s+[^>]+)?>(.*?)<\/em>/gi, '_$1_')
			.replace(/<s(?:\s+[^>]+)?>(.*?)<\/s>/gi, '~$1~')
			.replace(
				/<span class="ql-emojiblot".*?>.*?<span class="ap ap-(\w+)">(.*?)<\/span>.*?<\/span>.*?<\/span>/gi,
				'$2'
			);

		setFormattedText(textFormatted);

		navigator.clipboard.writeText(textFormatted);

		Swal.fire({
			icon: 'success',
			title: '¡Texto Formateado y copiado!',
			footer: '<a href="">Ahora solo queda pegarlo en el chat 😁</a>',
			timer: 1000,
			showConfirmButton: false,
		});
	};

	return (
		<div>
			<div className='flex  flex-col md:flex-row items-center md:justify-center align-top mb-8 md:gap-[80px] '>
				<div className='h-[400px] md:w-1/3 mb-8  w-[280px] text'>
					<ReactQuill
						ref={editorRef}
						modules={modules}
						formats={formats}
						className='h-[320px] my-3 '
						onChange={(e, delta, source, editor) =>
							handleFormat(e, delta, source, editor)
						}
					/>
				</div>
				<div className=' md:w-1/3 mt-3 w-[200px] '>
					{!empty && formattedText ? (
						<textarea
							readOnly
							cols={50}
							rows={15}
							defaultValue={formattedText}
							className='resize-none select-none outline-none read-only: max-w-[330px] lg:max-w-full '
						/>
					) : (
						<div className='flex flex-col items-center justify-center md:h-full'>
							<p className='font-bold italic  md:text-center'>
								Aquí aparecerá el texto formateado
							</p>
							<img
								src='https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg'
								alt='whatsapp-logo'
								className='w-32 h-32 mt-4 drop-shadow-2xl'
							/>
						</div>
					)}
				</div>
			</div>
			<div className='text-center'>
				<button
					className='bg-green-500 rounded-lg p-2 uppercase font-bold shadow-2xl'
					onClick={formatTextToWhatsApp}
				>
					Formatear texto
				</button>
			</div>
		</div>
	);
}
export default Input;
