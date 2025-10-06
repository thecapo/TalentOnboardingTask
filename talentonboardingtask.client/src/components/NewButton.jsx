export const NewButton = ({ setFormData, setOpen, entityName }) => {
    return (
        <button className="text-white py-[18px] mb-4 bg-blue-600 text-white px-4 rounded float-left"
            onClick={() => {
                setFormData('')
                setOpen(true)
            }}
        >
            {`New ${entityName}`}
        </button>
    )
}