<template>
  <div>
    <!-- container -->
    <div class="drive-select container">
      <!-- loader -->
      <Loader v-if="showLoader"/>
      <!-- Progress Loader -->
      <ProgressLoader v-else-if="loaderStage > 0" :stage="roundedLoaderStage"/>
      <!-- drives -->
      <div v-else-if="!path" style="width:100%;">
        <div @click="setPath(`${drive}/`)" v-for="drive in drives" :key="drive" class="explorer-item">
          <span class="material-icons">storage</span>
          <p>{{drive}}</p>
        </div>
      </div>
      <!-- dir -->
      <div v-else-if="path && !showFile && dir.length > 0 && loaderStage <= 0" style="width:100%;">
        <div @click="routeClick(item)" v-for="item in dir" :key="item.name" class="explorer-item">
          <span v-if="item.isDir" class="material-icons color-folder">folder</span>
          <span v-else-if="checkFileType(imgFileType,item.name)" class="material-icons color-image">image</span>
          <span v-else class="material-icons color-file">description</span>
          <p>{{item.name}}</p>
        </div>
      </div>
      <p class="title" v-else-if="dir.length === 0 && !showLoader">No files in directory</p>
      <!-- image display -->
      <img :src="'data:image/png;base64, '+file" v-if="showFile && checkFileType(imgFileType,path)">
      <!-- pdf preview -->
      <PdfPreview v-else-if="showFile && checkFileType(['pdf'],path)" :base64="file" />
      <!-- file editor -->
      <textarea class="explorer-editor" v-else-if="showFile && !checkFileType(noPreview,path)" v-model="file"></textarea>
      <!-- no preview -->
      <p class="title" v-else-if="showFile && loaderStage <= 0">Cannot display this file type</p>
    </div>
      <!-- left controls -->
      <div class="explorer-controls explorer-controls--left">
        <button title="Go Back" @click="goBack" v-if="path">
          <span class="material-icons">west</span>
        </button>
        <button title="Refresh" id="explorer-refresh-btn" @click="refresh">
          <span class="material-icons">autorenew</span>
        </button>
        <button title="Download" @click="downloadFile">
          <span class="material-icons">download</span>
        </button>
        <button title="Save" v-if="showFile && !checkFileType(imgFileType,path) && !checkFileType(noPreview,path)" @click="save">
          <span class="material-icons">save</span>
        </button>
      </div>
      <!-- right controls -->
      <div class="explorer-controls explorer-controls--right">
        <router-link to="/account" title="Account">
          <span class="material-icons">person</span>
        </router-link>
        <button title="Settings">
          <span class="material-icons">settings</span>
        </button>
        <button @click="showDownloadPopup = true" title="Download Client Software">
          <span class="material-icons">help_outline</span>
        </button>
      </div>
      <!-- popup -->
      <Popup title="Error" :text="popupText+' Please Go Back'" removeCancel="true" acceptText="Go Back"
        v-if="showPopup" @closed="showPopup = false;$router.push({path:'pc-selector'})" />
      <!-- download popup -->
      <Popup v-if="showDownloadPopup" @cancel="showDownloadPopup = false" @accept="downloadClientSoftware" title="Download?" text="Do you want to download the client side software?" acceptText="Download" />
  </div>
</template>

<script>
import io from 'socket.io-client'
import path from 'path'
import ProgressLoader from '../components/ProgressLoader.vue'
import Popup from '../components/Popup.vue'
import Loader from '../components/Loader.vue'
import PdfPreview from '../components/PdfPreview.vue'
export default {
  components: { ProgressLoader, Popup, Loader, PdfPreview},
  name: 'explorer',
  data(){
    return{
      socket:io(),
      dir:[],
      drives:[],
      path:'',
      file:'',
      fileName:'',
      showFile:false,
      askedToDownloadFile:false,
      slices:[],
      maxSlices:null,
      showLoader:true,
      isZip:false,
      loaderStage:0,
      imgFileType:['png','jpg','jpeg'],
      noPreview:['bpm','tiff','psd','xls','doc','docx','odt','zip','rar','7z','tar',
      'iso','mdb','accde','frm','sqlite','exe','dll','so','class','jar','dat','ttf',
      'tte','ico','vmdk','vmsd','vmx','vmxf','nvram','wt','bson','mdmp'],
      //popup
      showPopup:false,
      popupText:null,
      //download popup
      showDownloadPopup:false,
    }
  },
  created(){
    this.socketEvents()
    this.socket.emit('setAdmin',localStorage.getItem('token'),(error) => {
      if(error){
        console.warn(error)
        this.popupText = error.error
        this.showPopup = true
        return
      }

      this.socket.emit('selectClient',this.$route.query.pc,(error) => {
        if(error){
          console.warn(error)
          this.popupText = error.error
          this.showPopup = true
        }

        this.socket.emit('getDrives')
      })
    })

    //sets up keyboard shortcuts
    window.addEventListener('keydown',(e) => {
      const element = e.target.tagName.toLowerCase()
      if(element === 'input' || element === 'textarea'){
        return
      }

      switch(e.key){
        case 'ArrowLeft':
          this.goBack()
          break;
        case 'a':
          this.goBack()
          break;
        case 'r':
          this.refresh()
          break;
      }
    })
  },
  beforeDestroy(){
    this.socket.disconnect()
  },
  watch:{
    '$route':function(e){
      const urlPath = e.query.path
      if(urlPath !== this.path){
        this.setPath(urlPath)
      }
    }
  },
  methods:{
      save(){
        this.socket.emit('saveFile',{
          path:this.path,
          data:this.file
        })
        this.goBack()
      },
      downloadFileDataToUserPc({fileName,fileData}){
        const simDownloadBtn = document.getElementById('sim-download-btn')
        simDownloadBtn.setAttribute('href',`data:application/octet-stream;base64, ${fileData}`)
        simDownloadBtn.setAttribute('download',fileName)
        simDownloadBtn.click()
      },
      downloadFile(){
        if(!this.showFile){
          this.fileName = `${this.path.replace(/^.*[\\/]/, '')}.zip`
          this.askedToDownloadFile = true
          this.isZip = true
          return this.socket.emit('zipFolder',this.path)
        }

        const fileName = this.path.replace(/^.*[\\/]/, '')
        let fileData = null

        if(this.checkFileType(this.imgFileType,fileName)){
          fileData = this.file
          this.downloadFileDataToUserPc({fileName,fileData})
        }else if(this.file){
          fileData = btoa(this.file)
          this.downloadFileDataToUserPc({fileName,fileData})
        }else{
          //ask for file
          this.fileName = fileName
          this.askedToDownloadFile = true
          this.socket.emit('getFile',this.path)
        }
      },
      setPath(path){
        this.path = path
        this.socket.emit('getDir',path)
        this.$router.push({path:'/explorer',query:{pc:this.$route.query.pc,path}}).catch(err => {err})
        this.showLoader = true
      },
      goBack(){
        let newPath = path.resolve(`${this.path}/..`)
        newPath = newPath.slice(1,newPath.length)
        this.file = ''
        this.showFile = false
        
        if(!newPath.length){
          return this.path = ''
        }

        if(newPath.length == 2){
          newPath = newPath+'/'
        }
        
        this.setPath(newPath)
      },
      routeClick(item){
        const itemPath = `${this.path}/${item.name}`

        if(item.isDir){
          this.setPath(itemPath)
        }else if(this.checkFileType([...this.noPreview],itemPath)){
          this.path = itemPath
          this.showFile = true
        }else{
          this.socket.emit('getFile',itemPath)
        }

        this.path = itemPath
      },
      sortDir(dir = []){
        const output = []

        //gets folders
        dir.forEach(item => {
          if(item.isDir){
            output.push(item)
          }
        })

        //gets files
        dir.forEach(item => {
          if(!item.isDir){
            output.push(item)
          }
        })

        return output
      },
      socketEvents(){
        this.socket.on('message',(msg) => {
            console.log(msg)
        })

        this.socket.on('sentDrives',(drives) => {
            this.drives = drives
            this.dir = drives
            this.showLoader = false
        })

        this.socket.on('sentDir',(data) => {
            this.dir = this.sortDir(data)
            this.showLoader = false
        })

        this.socket.on('sentSlice',(slice) => {
            if(!this.maxSlices){
              this.maxSlices = parseInt(/^{(\d)*}/.exec(slice)[0].replace(/{/,'').replace(/}/,''))
              slice = slice.replace(/^{(\d)*}/,'')
            }

            this.slices.push(slice)
            this.loaderStage += 100/this.maxSlices
            
            if(this.slices.length >= this.maxSlices){
              this.combineSlices()
            }
        })
      },
      combineSlices(){
        let output = ''

        this.slices.forEach(slice => {
          output += slice
        })

        if(this.askedToDownloadFile){
            this.downloadFileDataToUserPc({
              fileName:this.fileName,
              fileData:output
            })

            this.askedToDownloadFile = false
        }else{
          //shows file to user
          this.file = output
        }

        //if user downloaded a zip dont show file
        this.showFile = (this.isZip) ? false : true

        this.isZip = false
        this.loaderStage = 0
        this.slices = []
        this.maxSlices = null
      },
      checkFileType(extensions = [],fileName){
          //check for no file type
          if(extensions[0] !== 'png' && !/\.(.*)/.test(fileName)){
            return true
          }

          let startPartten = '.('
          let endPartten = ')$'

          extensions.forEach((extension,index) => {
              startPartten += extension

              if(index !== extensions.length-1){
                  startPartten += '|'
              }
          })

          const parrten = startPartten + endPartten
          const regex = new RegExp(parrten,'i')

          return regex.test(fileName)
      },
      refresh(){
        //refreshes
        if(this.path){
          this.setPath(this.path)
        }else{
          this.socket.emit('getDrives')
        }
        //animates btn
        const ref = document.getElementById('explorer-refresh-btn')
        ref.classList.add('spin')
        setTimeout(() => {ref.classList.remove('spin')},200)
      },
      downloadClientSoftware(){
        window.location = '/files/client-software'
      }
  },
  computed:{
    user(){
      return this.$store.state.user
    },
    roundedLoaderStage(){
      return Math.round(this.loaderStage)
    }
  }
}
</script>
