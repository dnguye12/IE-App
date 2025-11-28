import Image from "next/image";

const Logo = () => {
    return ( 
        <div className="inline-flex items-center justify-center bg-primary rounded-full h-14 w-14">
            <Image 
                src={"/logo.svg"}
                alt="FoodPlan Maker"
                width={32}
                height={32}
            />
        </div>
     );
}
 
export default Logo;