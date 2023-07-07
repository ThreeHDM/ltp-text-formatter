import React, { useRef, useState } from 'react';
import ReactQuill from 'react-quill';
// import Quill from 'quill';
import quillEmoji from 'quill-emoji';
import 'react-quill/dist/quill.snow.css';
import 'quill-emoji/dist/quill-emoji.css';
import Swal from 'sweetalert2';

function Input() {
	const editorRef = useRef(null);
	// let textToFormat = '';
  const [empty,setTextEmpty] = useState(true)
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
			['link', 'image', 'emoji'],
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
		'image',
		'emoji',
	];

	const handleFormat = (e, delta, source, editor) => {
    let textGetted = editor.getText()
    if(!textGetted){
      setTextEmpty(true)
    }else{
      setTextEmpty(false)
    }
		setTextToFormat(editor.getHTML());

     if (!empty && formattedText) {
				setFormattedText('');
			}
	};
  // console.log(textGetted)
	console.log('textToFormat', textToFormat);

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

		let textFormatted = textToFormat.replace(/<\/?p>/gi, '');
		textToFormat.replace(/<\/?br>/gi, '');
		textFormatted = textFormatted.replace(/<strong>(.*?)<\/strong>/gi, '*$1*');
		textFormatted = textFormatted.replace(/<em>(.*?)<\/em>/gi, '_$1_');
		textFormatted = textFormatted.replace(/<s>(.*?)<\/s>/gi, '~$1~');
		textFormatted = textFormatted.replace(/<ul>(.*?)<\/ul>/gi, '\n$1');
		textFormatted = textFormatted.replace(/<ol>(.*?)<\/ol>/gi, '\n$1');
		textFormatted = textFormatted.replace(/<li>(.*?)<\/li>/gi, '• $1\n');
		textFormatted = textFormatted.replace(/<\/?span[^>]*>/gi, '');

		setFormattedText(textFormatted);
		console.log('formattedText', formattedText);

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
						onChange={(e, delta, source, editor) => {
							handleFormat(e, delta, source, editor);
						}}
					/>
				</div>
				<div className=' w-1/3 mt-3'>
					{!empty && formattedText ? (
						<div className=''>{formattedText}</div>
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
