<script>
    import axios from 'axios';
    import { navigate } from 'svelte-routing';
    let admin_id = '';
    let password = '';
  
    const handleSubmit = async () => {
     try {
        const response = await axios.post('http://localhost:3000/admin/signup', {
          admin_id,
        password,
      });
      if(response.status === 200){
        alert(response.data.message);
        navigate('/AdminLogin')
        window.location.reload()
      }
     } catch (error) {
        alert(error.response.data.message)
     }
    };
  </script>

  
  <div class="w-[100vw] min-h-[100vh] bg-[#040517] flex justify-center items-center">
    <div class="bg-[#0C0716] w-[90%] md:w-[45%]  relative p-5 pb-8 rounded-[16px] border-[2px] border-[#4E5191]">

   
    <h2 class="text-center text-[white] ">Register Here</h2>
    <form class="flex w-full md:w-[80%] relative m-auto justify-center items-center flex-col" on:submit|preventDefault={handleSubmit}>
     <div class="w-[90%] mb-8 h-[50px]">
         <label class="w-full font-medium text-gray-500 dark:text-gray-400 [&>*]:mt-[0.35rem]" for="email">Email:</label>
       <input class="w-full mt-1 z-[1] bg-[#202140] rounded-md text-[white] h-[40px] border-[1px] border-[gray] pl-3" type="email" id="email" bind:value={admin_id} required />
     </div>
     <div class="w-[90%] mb-8 h-[50px]">
         <label class="w-full font-medium text-gray-500 dark:text-gray-400 [&>*]:mt-[0.35rem]" for="password">Password:</label>
       <input class="w-full mt-1 z-[1] bg-[#202140] rounded-md text-[white] h-[40px] border-[1px] border-[gray] pl-3" type="password" id="password" bind:value={password} required />
     </div>
  
     <div class="mt-5 w-[90%]">
        <button
          class="w-full text-sm rounded-lg py-3 bg-[#5263FF] btn-text"
          type="submit"
        >
           Get Started
        </button>
      </div>
    </form>
    <p class="text-[gray] text-center py-4">
        Already have an account ?{' '}
        <a href="/AdminLogin">
          <span class="text-[gray] cursor-pointer text-primary-800 hover:underline dark:text-primary-500 btn-text">
            Signin
          </span>
        </a>
      </p>
</div>
  </div>
  