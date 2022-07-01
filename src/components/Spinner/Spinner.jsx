import './Spinner.scss';

function Spinner() {
  return (
    <div className='loading-spinner'>
      <div className='lds-ring'>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}
export default Spinner;
