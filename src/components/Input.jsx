import React, { useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import quillEmoji from 'quill-emoji';
import 'react-quill/dist/quill.snow.css';
import 'quill-emoji/dist/quill-emoji.css';
import Swal from 'sweetalert2';

function Input() {
	const editorRef = useRef(null);
	const [empty, setTextEmpty] = useState(true);
	const [textToFormat, setTextToFormat] = useState('');
	const [formattedText, setFormattedText] = useState('');
	const modules = {
		toolbar: [
			[{ size: [] }],
			['bold', 'italic', 'strike'],
			[
				{ list: 'ordered' },
				{ list: 'bullet' },
				{ indent: '-1' },
				{ indent: '+1' },
			],
			['link', 'emoji'],
			['clean'],
		],
		'emoji-toolbar': true,
		'emoji-textarea': false,
		'emoji-shortname': true,
	};

	const formats = [
		'font',
		'size',
		'bold',
		'italic',
		'strike',
		'list',
		'bullet',
		'indent',
		'link',
		'emoji',
	];

	const handleFormat = (e, delta, source, editor) => {

		setTextEmpty(!editor.getText());

		setTextToFormat(editor.getHTML());

		if (!empty && formattedText) {
			setFormattedText('');
		}
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
			.replace(/<\/?p>/gi, '')
			.replace(/<br\s*\/?>/gi, '\n')
			.replace(/<p class="ql-indent-1">/g, '   \n')
			.replace(/<a.*?href="(.*?)".*?>(.*?)<\/a>/g, '$2')
			.replace(/<\/p>/g, '')
			.replace(/\n\s*\n/g, '\n')
			.replace(/<strong>(.*?)<\/strong>/gi, '*$1*')
			.replace(/<em>(.*?)<\/em>/gi, '_$1_')
			.replace(/<s>(.*?)<\/s>/gi, '~$1~')
			.replace(/<ul>(.*?)<\/ul>/gi, '\n$1')
			.replace(/<ol>(.*?)<\/ol>/gi, '\n$1')
			.replace(/<li>(.*?)<\/li>/gi, '• $1\n')
			.replace(/<\/?span[^>]*>/gi, '')
			.replace(/\s/g, ' \u200B');

		setFormattedText(textFormatted);
		

		navigator.clipboard.writeText(textFormatted).then(() => {
			console.log('Texto copiado al portapapeles');
		});

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
			<div className='flex items-center justify-evenly align-top mb-8'>
				<div className='h-[400px] w-1/3'>
					<ReactQuill
						ref={editorRef}
						modules={modules}
						formats={formats}
						className='h-[320px] my-3'
						onChange={(e, delta, source, editor) =>
							handleFormat(e, delta, source, editor)
						}
					/>
				</div>
				<div className=' w-1/3 mt-3'>
					{!empty && formattedText ? (
						<textarea
							readOnly
							cols={50}
							rows={15}
							defaultValue={formattedText}
							className='resize-none select-none outline-none read-only:'
						/>
					) : (
						<div className='flex flex-col items-center justify-center h-full'>
							<p className='font-bold italic text-center'>
								Aquí aparecerá el texto formateado
							</p>
							<img
								src='https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg'
								alt='whatsapp-logo'
								className='w-32 h-32 mt-4'
							/>
						</div>
					)}
				</div>
			</div>
			<div className='text-center'>
				<button
					className='bg-green-500 rounded-lg p-2 uppercase font-bold'
					onClick={formatTextToWhatsApp}
				>
					Formatear texto
				</button>
			</div>
		</div>
	);
}
export default Input;
