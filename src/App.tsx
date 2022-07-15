import React, { FormEvent } from 'react'
import { Photo} from './types/photo'
import * as C from './App.styles'
import * as Photos from './services/photos'
import {PhotoItem} from './components/index'


const App =  () =>{
  const [uploading, setUploading] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [photo, setPhoto] = React.useState<Photo[]>([])
  console.log(photo)

  React.useEffect(()=>{
    const getPhotos = async () =>{
      setLoading(true)
    setPhoto(await Photos.getAll()) ;
      setLoading(false)
    }
    getPhotos();
  },[])

  const handleForomSubmit = async (e: FormEvent<HTMLFormElement>) =>{
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const file = formData.get('image') as File;
      if(file && file.size > 0){
        setUploading(true)
        let result = await Photos.insert(file)
          setUploading(false)
        if (result instanceof Error){
          alert(`${result.name} - ${result.message}`)
        }
        else{
          let newPhotoList = [...photo];
          newPhotoList.push(result)
          setPhoto(newPhotoList);
        }


      }
      else{
        return
      }

  }

  return (
    <C.Container>
      <C.Area>
        <C.Header> Galeria de Fotos</C.Header>
          <C.UploadFrom method='FROM' onSubmit={handleForomSubmit}>
            <input type='file' name='image'/>
            <input type='submit' name='Enviar'/>
            {uploading && 'Enviando foto...'}
          </C.UploadFrom>

        {loading &&<C.Loading>Carregando</C.Loading>}
         {!loading && photo.length > 0 &&
          <C.PhotoList>
            {photo.map((item, index) =>(
            <PhotoItem key={index} url={item.url} name={item.name}/>
          ))}
          </C.PhotoList>
        }

        {!loading && photo.length === 0 && <C.Loading>Nao há fotos cadastradas :/ </C.Loading>}
       </C.Area>
    </C.Container>
  );
}

export default App;