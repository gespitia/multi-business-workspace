import{defineConfig}from'vite';

export default defineConfig(({mode})=>{
  if(mode==='microfrontend'){
    return{
      base:'./',
      build:{
        outDir:'dist-micro',
        emptyOutDir:true,
        lib:{
          entry:'src/microfrontend.ts',
          formats:['es'],
          fileName:'multi-business-workspace'
        }
      }
    };
  }
  return{base:'./'};
});
