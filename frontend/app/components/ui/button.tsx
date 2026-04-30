import type { ReactNode } from "react"

type ButtonProps = ({
    label: string
    icon?: ReactNode
    isActive: boolean
})

const styles: any = {
    secondary: "bg-[#F5F5F5]",
    danger: "text-red-500 hover:bg-red-100",
}

export default function Button({ label, icon, isActive }: ButtonProps) {

  return (
    <button className={`px-10 py-1 mt-4 transition-all duration-200 text-[#171717] rounded-xl hover:bg-[#F5F5F5] hover:text-black ${isActive ? styles["secondary"] : null} `}>
      <div className="flex">
        <span className="mr-2">{icon}</span> <>{label}</>
      </div>
    </button>
  )
}