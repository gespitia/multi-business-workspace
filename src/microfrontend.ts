import{mount,type MountOptions}from'./main';

export class MultiBusinessWorkspaceElement extends HTMLElement{
  static observedAttributes=['tenant-id','role'];
  private root=this.attachShadow({mode:'open'});
  private mounted=false;

  connectedCallback(){this.render();}
  disconnectedCallback(){this.mounted=false;this.root.replaceChildren();}
  attributeChangedCallback(){if(this.isConnected)this.render();}

  private render(){
    this.root.replaceChildren();
    const options:MountOptions={
      tenantId:this.getAttribute('tenant-id')||undefined,
      role:(this.getAttribute('role') as MountOptions['role'])||undefined,
      onEvent:event=>this.dispatchEvent(new CustomEvent('workspace-event',{detail:event,bubbles:true,composed:true}))
    };
    mount(this.root,options);
    this.mounted=true;
    this.dispatchEvent(new CustomEvent('workspace-ready',{detail:{tenantId:options.tenantId,role:options.role},bubbles:true,composed:true}));
  }
}

if(!customElements.get('multi-business-workspace')){
  customElements.define('multi-business-workspace',MultiBusinessWorkspaceElement);
}

export function mountMultiBusinessWorkspace(
  target:HTMLElement,
  options:MountOptions={}
){
  return mount(target,options);
}
