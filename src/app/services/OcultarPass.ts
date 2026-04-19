import bcrypt from "bcryptjs";
import { Injectable } from '@angular/core'
@Injectable({
  providedIn: 'root' 
})
export class OculterPass{
    async passwordOculter(password: string): Promise<string>{        
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password,salt);
    }
    async passwordComparer(pass: string, passDB: string):Promise<boolean>{
        const validPass = await bcrypt.compare(pass, passDB);
        return await validPass;  
    }


}