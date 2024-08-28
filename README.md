### 依赖包

- moment

### 使用示例

- 指定宽度
- children 为标题，自己开发
- dateValue 必传
- onChangeCallback

```javascript
<div style={{ width: 1200 }}>
  <SliderDatePicker
    // dateValue={dayjs().format('YYYY-MM-DD')}
    dateValue="2024-07-02"
    onChangeCallback={mdate => {
      console.log(mdate.format('YYYY-MM-DD'));
    }}
  >
    <div>
      <span style={{ color: '#000', fontSize: '24px', fontWeight: 600 }}>
        DEMO
      </span>
      <span>desc 16</span>
    </div>
  </SliderDatePicker>
</div>
```

### 开发

- git acm
- npm run release patch
- npm publish
- git push
