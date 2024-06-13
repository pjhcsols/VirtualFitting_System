https://huggingface.co/levihsu/OOTDiffusion/tree/main/checkpoints <br>
여기에서 ootd, humanparsing, openpose 폴더의 파일들을 다운받을 수 있습니다.

https://huggingface.co/openai/clip-vit-large-patch14/tree/main <br>
여기에서 clip-vit-large-patch14 폴더의 파일들을 다운받을 수 있습니다.

├── [checkpoints]
<br><br>
│   ├── [ootd]<br>
│   │   ├── [feature_extractor]<br>
│   │   │   ├── preprocessor_config.json<br>
│   │   ├── [ootd_dc]<br>
│   │   │   ├── [checkpoint-36000]<br>
│   │   │   │   ├── [unet_garm]<br>
│   │   │   │   │   ├── config.json<br>
│   │   │   │   │   ├── diffusion_pytorch_model.safetensors<br>
│   │   │   │   ├── [unet_vton]<br>
│   │   │   │   │   ├── config.json<br>
│   │   │   │   │   ├── diffusion_pytorch_model.safetensors<br>
│   │   ├── [ootd_hd]<br>
│   │   │   ├── [checkpoint-36000]<br>
│   │   │   │   ├── [unet_garm]<br>
│   │   │   │   │   ├── config.json<br>
│   │   │   │   │   ├── diffusion_pytorch_model.safetensors<br>
│   │   │   │   ├── [unet_vton]<br>
│   │   │   │   │   ├── config.json<br>
│   │   │   │   │   ├── diffusion_pytorch_model.safetensors<br>
│   │   ├── [scheduler]<br>
│   │   │   ├──scheduler_config.json<br>
│   │   ├── [text_encoder]<br>
│   │   │   ├── config.json<br>
│   │   │   ├── pytorch_model.bin<br>
│   │   ├── [tokenizer]<br>
│   │   │   ├── merges.txt<br>
│   │   │   ├── special_tokens_map.json<br>
│   │   │   ├── tokenizer_config.json<br>
│   │   │   ├── vocab.json<br>
│   │   ├── [vae]<br>
│   │   │   ├── config.json<br>
│   │   │   ├── diffusion_pytorch_model.bin<br>
│   │   ├── model_index.json<br>
<br>
│   ├── [humanparsing]<br>
│   │   ├── exp-schp-201908261155-lip.pth<br>
│   │   ├── exp-schp-201908301523-atr.pth<br>
│   │   ├── parsing_atr.onnx<br>
│   │   ├── parsing_lip.onnx<br>
<br>
│   ├── [openpose]<br>
│   │   ├── [ckpts]<br>
│   │   │   ├── body_pose_model.pth<br>
<br>
│   ├── [clip-vit-large-patch14]<br>
│   │   ├── .gitattributes<br>
│   │   ├── README.md<br>
│   │   ├── config.json<br>
│   │   ├── flax_model.msgpack<br>
│   │   ├── merges.txt<br>
│   │   ├── model.safetensors<br>
│   │   ├── preprocessor_config.json<br>
│   │   ├── pytorch_model.bin<br>
│   │   ├── special_tokens_map.json<br>
│   │   ├── tf_model.h5<br>
│   │   ├── tokenizer.json<br>
│   │   ├── tokenizer_config.json<br>
│   │   ├── vocab.json<br>


