#!/usr/bin/env python3
"""
测试 Biotools API 的功能
"""

import requests
import json

API_BASE = "http://localhost:8000"

def test_health_check():
    """测试健康检查"""
    print("🔍 测试健康检查...")
    response = requests.get(f"{API_BASE}/health")
    print(f"状态码: {response.status_code}")
    print(f"响应: {response.json()}")
    print()

def test_single_sequence():
    """测试单个序列处理"""
    print("🧬 测试单个序列处理...")
    
    # 测试反向互补
    data = {
        "sequence": "ATCGATCG",
        "sequence_type": "dna"
    }
    response = requests.post(f"{API_BASE}/sequence/reverse-complement", json=data)
    print(f"反向互补: {response.json()}")
    
    # 测试转录
    response = requests.post(f"{API_BASE}/sequence/transcribe", json=data)
    print(f"转录: {response.json()}")
    
    # 测试统计
    response = requests.post(f"{API_BASE}/sequence/stats", json=data)
    print(f"统计: {response.json()}")
    print()

def test_fasta_batch():
    """测试 FASTA 批量处理"""
    print("📄 测试 FASTA 批量处理...")
    
    # 读取测试 FASTA 文件
    with open("test_sequences.fasta", "r") as f:
        fasta_content = f.read()
    
    data = {
        "fasta_content": fasta_content,
        "sequence_type": "auto"
    }
    
    # 测试批量反向互补
    response = requests.post(f"{API_BASE}/fasta/reverse-complement", json=data)
    result = response.json()
    print(f"批量反向互补:")
    print(f"  总数: {result['total_count']}")
    print(f"  成功: {result['success_count']}")
    print(f"  错误: {result['error_count']}")
    if result['errors']:
        print(f"  错误详情: {result['errors']}")
    
    # 测试批量统计
    response = requests.post(f"{API_BASE}/fasta/stats", json=data)
    result = response.json()
    print(f"批量统计:")
    print(f"  总数: {result['total_count']}")
    print(f"  成功: {result['success_count']}")
    print(f"  错误: {result['error_count']}")
    
    # 显示前几个结果
    for i, stats in enumerate(result['results'][:3]):
        print(f"  序列 {i+1} ({stats['sequence_id']}): {stats['sequence_type']}, 长度 {stats['length']}")
    
    print()

def main():
    """主测试函数"""
    print("🚀 开始测试 Biotools API")
    print("=" * 50)
    
    try:
        test_health_check()
        test_single_sequence()
        test_fasta_batch()
        print("✅ 所有测试完成！")
    except requests.exceptions.ConnectionError:
        print("❌ 无法连接到 API 服务器，请确保后端服务正在运行")
    except Exception as e:
        print(f"❌ 测试过程中出现错误: {e}")

if __name__ == "__main__":
    main()
