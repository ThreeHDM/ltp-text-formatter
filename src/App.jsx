import Input from './components/Input';

function App() {
	return (
		<div className='min-h-screen md:h-screen flex flex-col justify-center py-4 md:p-0'>
			<h2 className='text-xl px-0.5 md:text-2xl uppercase font-bold text-center md:my-4'>
				⚖ LTP Whatsapp Text formatter
			</h2>
			<Input />
		</div>
	);
}

export default App;
